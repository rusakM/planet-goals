import { addSeconds } from 'date-fns';
import { accountService, gameService, lessonService, playerGameService, socketService } from '.';
import { ConstantsGame } from '../core/constants';
import { RedisConnector } from '../core/redisConnector';

export interface ILeaderboardPlayer {
    playerId: string;
    playerLastName: string;
    playerName: string;
    playerPoints: number;
    playerPosition: number;
    playerRole: ConstantsGame.Game.PLAYER_ROLE;
}

export interface IActivePlayer {
    disconnected?: boolean;
    playerGame?: playerGameService.Model.IPlayerGame;
    playerRole?: ConstantsGame.Game.PLAYER_ROLE;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
}

/**
 * Stan gry trzymany w silniku (RAM)
 */
export interface IGameState {
    gameId: string;
    lesson: lessonService.Model.ILesson;
    questions: lessonService.Model.IQuestion[];
    players: IActivePlayer[];
    currentQuestionIndex: number;
    currentSubquestionIndex: number;
    singlePlayerMode: boolean;
    started: boolean;
    startTime: number | null;
    // kiedy timeout się skończy (ms)1
    subquestionStartTime: number | null;
    subquestionEndTime: number | null;
    // KEY: userId, VALUE: odpowiedzi i scoring na konkrentne subquestion
    answers: { [userId: string]: { [q: number]: { [sq: number]: { answer: string; points: number; responseTime: number } } } };
    // do obsługi timeoutów per subquestion
    subquestionTimer?: NodeJS.Timeout;
    // KNOWN issues: przy reconnect musimy dla danego usera "dociągnąć" playerGame z DB
    stage: ConstantsGame.Game.STAGE_ENUM;
}

export interface IProcessedAnswer {
    correct: boolean;
    done: boolean;
    error?: string;
    points: number;
}

export let gameManager: GameManagerService;

class GameManagerService {
    /**
     * gameId -> GameState
     */
    private games: Map<string, IGameState> = new Map();
    private redis: RedisConnector<IGameState>;
    public currentConnectedPlayers: Set<string>;

    constructor() {
        this.redis = new RedisConnector<IGameState>('gameManager', 24 * 60 * 60);
        this.currentConnectedPlayers = new Set();
        setTimeout(() => this.initializeStartedGames(), 1500);
    }

    public async initializeStartedGames() {
        console.log('Initialize games...');
        const allGames = await this.redis.getAll();
        console.log(allGames?.length);
        allGames.forEach((game) => {
            this.games.set(game.gameId, game);
            this.broadcastSubquestion(game.gameId, game?.subquestionEndTime || null);
            console.log(`Game ${game.gameId} initialized.`);
        });
    }

    public async getGame(gameId: string): Promise<IGameState> {
        let game = this.games.get(gameId);
        if (!game) {
            game ||= await this.redis.get(gameId);
            if (game) this.games.set(game.gameId, game);
        }

        return game;
    }

    /**
     * Inicjalizuje nową grę w silniku, po wywołaniu startGame
     */
    async initializeGame(game: gameService.Model.IGame, lesson: lessonService.Model.ILesson, playerGames: playerGameService.Model.IPlayerGame[]) {
        console.log(`Initialize game, ${game._id} with lesson: ${lesson._id}`);
        const questions = lesson.questions ?? [];
        const stage = questions[0]?.gameStage ?? ConstantsGame.Game.STAGE_ENUM.QUICK_CONTENT;
        const state: IGameState = {
            gameId: game._id,
            lesson,
            questions,
            players: game.players?.map((pg) => ({
                userId: pg._id,
                disconnected: !!this.currentConnectedPlayers.has(pg._id),
                playerGame: playerGames?.find((playerGame) => playerGame?.playerId === pg._id) || null,
                playerRole: pg.playerRole,
                firstName: pg.firstName,
                lastName: pg.lastName,
                email: pg.email,
            })),
            currentQuestionIndex: 0,
            currentSubquestionIndex: 0,
            singlePlayerMode: game.singlePlayerMode,
            started: false,
            startTime: null,
            subquestionEndTime: null,
            subquestionStartTime: null,
            answers: {},
            subquestionTimer: undefined,
            stage,
        };
        this.games.set(game._id, state);
        await this.redis.save(game._id, state);
    }

    async startGame(gameId: string) {
        const game = await this.getGame(gameId);
        if (!game) {
            console.log(`No game with id: ${gameId}`);
            return null;
        }
        if (game.started) {
            return game;
        }
        game.started = true;
        game.startTime = Date.now();
        const playerGames = await playerGameService.DB.Find.byIndex('gameId', gameId);
        if (playerGames.length) {
            game.players = game.players?.map((gamePlayer) => {
                const playerGame = playerGames.find((item) => item.playerId === gamePlayer.userId);
                return {
                    ...gamePlayer,
                    playerGame: playerGame ?? gamePlayer?.playerGame,
                };
            });
        }
        await this.redis.save(gameId, game);
        socketService.Player.onGameStart({
            gameId,
            users: this.getPlayersList(gameId),
            waitingTimeUntil: game.startTime + ConstantsGame.Game.GAME_START_WAITING_TIME_MS,
        });

        setTimeout(async () => {
            const currentInfo = this.getCurrentSubquestion(gameId);
            const subq = currentInfo?.subquestion;
            const subqTimeUntil = this.calculateSubquestionTimeUntil(subq);
            await this.broadcastSubquestion(gameId, subqTimeUntil);
            if (subq?.timeInSek && (game.stage !== ConstantsGame.Game.STAGE_ENUM.COMPETITION || game.singlePlayerMode)) {
                await this.startSubquestionTimer(gameId, subqTimeUntil);
            }
            await this.redis.save(gameId, this.games.get(gameId)!);
        }, ConstantsGame.Game.GAME_START_WAITING_TIME_MS);

        return game;
    }

    /**
     * Dołącz użytkownika do gry przez websocket, rejestrując jego socket, odsyłając aktualny subquestion.
     * @returns null lub error jeśli nie można dołączyć (np. gra skończona)
     */
    async joinPlayer(user: accountService.Model.IAccount, gameId: string, playerGameData: IActivePlayer) {
        const game = await this.getGame(gameId);
        console.log('Joining to game gameId');
        if (!game) {
            console.log('Player join: game not exist');
            return 'NO_GAME';
        }
        // Można dodać logikę blokowania dołączenia kiedy gra jest zakończona
        const existing = game.players.find((x) => x.userId === user._id.toString());
        if (existing) {
            existing.disconnected = false;
        } else {
            game.players.push(playerGameData);
        }
        if (!game.started) {
            const users = game.players.map(({ userId }) => userId);
            socketService.Player.onPlayerJoin({
                _id: user._id,
                email: user.email,
                gameId,
                firstName: user.firstName,
                lastName: user.lastName,
                role: playerGameData?.playerGame?.playerRole ?? ConstantsGame.Game.PLAYER_ROLE.player,
                users,
            });
        } else {
            const timeSinceStart = Date.now() - game.startTime;
            if (timeSinceStart < ConstantsGame.Game.GAME_START_WAITING_TIME_MS)
                socketService.Player.onGameStart({
                    gameId,
                    users: [user._id],
                    waitingTimeUntil: game.startTime + ConstantsGame.Game.GAME_START_WAITING_TIME_MS,
                });
        }
        await this.redis.save(gameId, game);
        //this.sendPlayerGameToUser(gameId, user._id);
        return null;
    }

    async deletePlayer(playerId: string, gameId: string) {
        console.log('Remove player from game: ', gameId);
        const game = await this.getGame(gameId);
        if (!game) return;
        const users = this.getPlayersList(gameId);
        const playerGameIdx = game.players.findIndex(({ userId }) => userId === playerId);
        if (playerGameIdx < 0) return;
        game.players.splice(playerGameIdx, 1);
        await this.redis.save(gameId, game);
        console.log('Remove player success');
        socketService.Player.onPlayerDelete({ users, gameId, playerId });
    }

    /**
     * Zwróć aktualny subquestion (lub null jeśli gra się skończyła)
     */
    getCurrentSubquestion(gameId: string): { question: lessonService.Model.IQuestion; subquestion: lessonService.Model.ISubquestion; qIndex: number; sqIndex: number } | null {
        const game = this.games.get(gameId);
        if (!game) return null;
        const q = game.questions[game.currentQuestionIndex];
        if (!q) return null;
        const sq = q.subquestions?.[game.currentSubquestionIndex];
        if (!sq) return null;
        return { question: q, subquestion: sq, qIndex: game.currentQuestionIndex, sqIndex: game.currentSubquestionIndex };
    }

    /**
     * Zwraca stan playerGame dla konkretnego userId
     */
    getPlayerGame(gameId: string, userId: string): playerGameService.Model.IPlayerGame | null {
        const game = this.games.get(gameId);
        if (!game) return null;
        const player = game.players.find((x) => x.userId == userId);
        return player?.playerGame ?? null;
    }

    getPlayersList(gameId: string): string[] {
        const game = this.games.get(gameId);
        if (!game) return [];
        return game.players.map(({ userId }) => userId);
    }

    /**
     * Akceptuj odpowiedź dla aktywnego gracza – obsługuje scoring, timeout, blokuje wielokrotne odpowiedzi itp.
     */
    async processAnswer(gameId: string, userId: string, answer: string, questionIndex: number, subquestionIndex: number, responseTime: number): Promise<IProcessedAnswer> {
        console.log(gameId, userId, answer, questionIndex);
        const game = await this.getGame(gameId);
        if (!game) return { points: 0, correct: false, done: false, error: 'NO_GAME' };
        const q = game.questions[game.currentQuestionIndex];
        if (!q) return { points: 0, correct: false, done: false, error: 'NO_QUESTION' };
        const sq = q.subquestions?.[game.currentSubquestionIndex];
        if (!sq) return { points: 0, correct: false, done: false, error: 'NO_SUBQUESTION' };
        if ((questionIndex !== game.currentQuestionIndex || subquestionIndex !== game.currentSubquestionIndex) && game.stage === ConstantsGame.Game.STAGE_ENUM.KNOWLEDGE && !game.singlePlayerMode) {
            console.log('questionIndexes:', game.currentQuestionIndex, questionIndex, 'subquestionIndexes:', game.currentSubquestionIndex, subquestionIndex);
            return { points: 0, correct: false, done: false, error: 'INCORRECT_QUESTION' };
        }
        if (questionIndex !== game.currentQuestionIndex && !game.singlePlayerMode) {
            console.log('questionIndexes:', game.currentQuestionIndex, questionIndex, 'subquestionIndexes:', game.currentSubquestionIndex, subquestionIndex);
            return { points: 0, correct: false, done: false, error: 'INCORRECT_QUESTION' };
        }

        if (!game.answers[userId]) game.answers[userId] = {};
        if (!game.answers[userId][game.currentQuestionIndex]) game.answers[userId][game.currentQuestionIndex] = {};
        if (game.answers[userId][game.currentQuestionIndex][game.currentSubquestionIndex]) {
            // Already replied
            return { points: 0, correct: false, done: false, error: 'ALREADY_ANSWERED' };
        }

        // Scoring
        let correct = false;
        let points = 0;
        if (game.stage === ConstantsGame.Game.STAGE_ENUM.QUICK_CONTENT) {
            points = 0;
            correct = true;
        } else {
            correct = gameService.checkAnswer(sq, answer);
            const subsLen = q.subquestions?.length || 1;
            const sqMaxPoints = Number(((q.maxPoints || 0) / subsLen).toFixed());
            if (game.stage === ConstantsGame.Game.STAGE_ENUM.KNOWLEDGE || game.singlePlayerMode) {
                points = correct ? sqMaxPoints : 0;
            } else if (game.stage === ConstantsGame.Game.STAGE_ENUM.COMPETITION && !game.singlePlayerMode) {
                if (correct) {
                    // timeRatio = (answerTime - questionStartTime) / totalQuestionTime
                    const timeRatio = (responseTime - game.subquestionStartTime) / (sq.timeInSek * 1000);
                    // punkty = maxPoints × (1 - timeRatio)²
                    points = Number((sqMaxPoints * Math.pow(1 - timeRatio, 2)).toFixed(2));
                } else {
                    points = 0;
                }
            }
        }
        game.answers[userId][game.currentQuestionIndex][game.currentSubquestionIndex] = { answer, points, responseTime };
        await this.redis.save(gameId, game);
        return { points, correct, done: true };
    }

    /**
     * Uruchamia timeout, po którym automatycznie zmieniana jest subquestion (oraz przyznaje tym co nie odpowiedzieli punkty=0).
     * Wywołuj zawsze po wysłaniu nowego subquestion do graczy.
     */
    calculateSubquestionTimeUntil(subquestion: lessonService.Model.ISubquestion): number {
        const timeUntil = addSeconds(new Date(), subquestion?.timeInSek || ConstantsGame.Game.GAME_START_WAITING_TIME_MS).getTime();
        if (subquestion?.answers?.length) return timeUntil + ConstantsGame.Game.GAME_FEEDBACK_TIME_MS;
        return timeUntil;
    }

    async startSubquestionTimer(gameId: string, timeUntil: number) {
        const game = this.games.get(gameId);
        if (!game) return;
        await this.stopSubquestionTimer(gameId);
        game.subquestionEndTime = timeUntil;
        game.subquestionStartTime = Date.now();
        game.subquestionTimer = setTimeout(async () => await this.nextSubquestion(gameId), timeUntil - Date.now());
        await this.redis.save(gameId, game);
    }

    async stopSubquestionTimer(gameId: string) {
        const game = this.games.get(gameId);
        if (game?.subquestionTimer) {
            clearTimeout(game.subquestionTimer);
            game.subquestionTimer = undefined;
            await this.redis.save(gameId, game);
        }
    }

    calculateQuestionTimeUntil(question: lessonService.Model.IQuestion): number {
        const totalTimeInSek = question.subquestions.reduce((sum, sq) => {
            return sum + (sq.timeInSek || 0);
        }, 0);

        return addSeconds(new Date(), totalTimeInSek).getTime();
    }

    async startQuestionTimer(gameId: string, timeUntil: number) {
        const game = this.games.get(gameId);
        if (!game) return;

        const currentQuestion = game.questions[game.currentQuestionIndex];
        if (!currentQuestion?.subquestions) return;
        if (!timeUntil) timeUntil = this.calculateQuestionTimeUntil(currentQuestion);
        this.stopSubquestionTimer(gameId);
        game.subquestionEndTime = timeUntil;
        game.subquestionStartTime = Date.now();
        game.subquestionTimer = setTimeout(async () => {
            // Po zakończeniu czasu przechodzimy do następnego pytania
            let nextQuestionIndex = game.currentQuestionIndex + 1;
            if (game?.singlePlayerMode && game.questions?.[nextQuestionIndex]?.type === ConstantsGame.Question.TYPES_ENUM.LEADERBOARD) nextQuestionIndex++;
            if (nextQuestionIndex >= game.questions.length) {
                // Jeśli to było ostatnie pytanie, kończymy grę
                await this.endGame(gameId);
            } else {
                // Przechodzimy do następnego pytania i ustawiamy subquestion na 0
                game.currentQuestionIndex = nextQuestionIndex;
                game.currentSubquestionIndex = 0;
                game.stage = game.questions[nextQuestionIndex]?.gameStage ?? game.stage;
                const isCompetition = game.stage === ConstantsGame.Game.STAGE_ENUM.COMPETITION && !game.singlePlayerMode;
                const nqTimeUntil = isCompetition ? this.calculateQuestionTimeUntil(game.questions[nextQuestionIndex]) : this.calculateSubquestionTimeUntil(game.questions[nextQuestionIndex].subquestions[0]);
                await this.broadcastSubquestion(gameId, nqTimeUntil);

                // Jeśli następne pytanie też jest w trybie COMPETITION, startujemy timer dla niego
                if (isCompetition) {
                    await this.startQuestionTimer(gameId, nqTimeUntil);
                } else {
                    // Jeśli nie jest w trybie COMPETITION, wracamy do standardowego timera
                    await this.startSubquestionTimer(gameId, nqTimeUntil);
                }
            }
            await this.redis.save(gameId, game);
        }, timeUntil - Date.now());

        await this.redis.save(gameId, game);
    }

    /**
     * Przechodzi do kolejnego subquestion w lekcji. Jeśli skończone → kończy grę i rozsyła leaderboard.
     */
    async nextSubquestion(gameId: string) {
        const game = await this.getGame(gameId);
        if (!game) return;
        // Najpierw przyznaj 0 punktów wszystkim którzy nie odpowiedzieli
        const players = game.players;
        for (const p of players) {
            if (!game.answers[p.userId]?.[game.currentQuestionIndex]?.[game.currentSubquestionIndex]) {
                if (!game.answers[p.userId]) game.answers[p.userId] = {};
                if (!game.answers[p.userId][game.currentQuestionIndex]) game.answers[p.userId][game.currentQuestionIndex] = {};
                game.answers[p.userId][game.currentQuestionIndex][game.currentSubquestionIndex] = { answer: '', points: 0, responseTime: 0 };
            }
        }
        // Przejdź do następnego pytania
        let nq = game.currentQuestionIndex;
        let ns = game.currentSubquestionIndex + 1;
        const currQuestion = game.questions[nq];
        if (currQuestion && currQuestion.subquestions && ns >= currQuestion.subquestions.length) {
            // Next question
            nq++;
            ns = 0;
            if (game.singlePlayerMode && game.questions?.[nq]?.type === ConstantsGame.Question.TYPES_ENUM.LEADERBOARD) nq++;
        }
        if (nq >= game.questions.length) {
            // End game
            await this.endGame(gameId);
            return;
        }
        game.currentQuestionIndex = nq;
        game.currentSubquestionIndex = ns;
        // Zmień stage jeśli potrzeba:
        game.stage = game.questions[nq]?.gameStage ?? game.stage;
        const isCompetition = game.stage === ConstantsGame.Game.STAGE_ENUM.COMPETITION && !game.singlePlayerMode;
        const timeUntil = isCompetition ? this.calculateQuestionTimeUntil(game.questions[nq]) : this.calculateSubquestionTimeUntil(game.questions[nq].subquestions[ns]);

        await this.broadcastSubquestion(gameId, timeUntil);
        // Ustal timeout dla nowych subquestions
        const nextSq: lessonService.Model.ISubquestion | undefined = game.questions[nq]?.subquestions?.[ns];
        if (nextSq?.timeInSek) {
            if (isCompetition) {
                if (ns === 0) {
                    // tylko dla pierwszego subquestion w trybie competition
                    await this.startQuestionTimer(gameId, timeUntil);
                }
            } else {
                await this.startSubquestionTimer(gameId, timeUntil);
            }
        }
        await this.redis.save(gameId, game);
    }

    public async enforceNextSubquestion(gameId) {
        const game = await this.getGame(gameId);
        if (!game || !game.started || !game.singlePlayerMode) return;
        if (game.currentQuestionIndex === game.questions.length - 1 && game.currentSubquestionIndex === game.questions?.[game.currentQuestionIndex]?.subquestions?.length - 1) return;

        await this.nextSubquestion(gameId);
    }

    /**
     * Wysyła aktualny subquestion do wszystkich graczy w pokoju (Socket.io room)
     */
    async broadcastSubquestion(gameId: string, timeUntil: number) {
        const info = this.getCurrentSubquestion(gameId);
        if (!info) return;
        if (ConstantsGame.Question.LEADERBOARD_QUESTION_TYPES.includes(info?.question?.type)) {
            await this.sendLeaderboard(gameId);
        }

        socketService.Player.onGameSubquestion({
            question: info.qIndex,
            subquestion: info.sqIndex,
            gameId,
            timeUntil,
            users: this.getPlayersList(gameId),
        });
    }

    /**
     * Wysyła stan gry (playerGame/points itp.) do danego usera (np. po reconnect itp.)
     */
    async sendPlayerGameToUser(gameId: string, userId: string) {
        const game = await this.getGame(gameId);
        if (!game) return;
        const player = game.players.find((x) => x.userId === userId);
        socketService.Player.onPlayerGame({
            gameId,
            playerGame: player?.playerGame,
            userId,
        });
    }

    /**
     * Wysyła leaderboard po zakończeniu gry, oraz ustawia grę jako "skończoną" (nie można joinować!)
     */
    async getLeaderboard(gameId: string) {
        const game = await this.getGame(gameId);
        if (!game) return;
        // Licz punkty dla każdego gracza
        const leaderboard: ILeaderboardPlayer[] = game.players.map((p, idx) => {
            // sumuj punkty
            let points = 0;
            for (const qid in game.answers[p.userId]) {
                for (const sqid in game.answers[p.userId][qid]) {
                    points += game.answers[p.userId][qid][sqid].points;
                }
            }
            return {
                playerId: p.userId,
                playerLastName: p.lastName,
                playerName: p.firstName,
                playerPoints: points,
                playerPosition: idx + 1,
                playerRole: p.playerRole,
            };
        });
        // Sortuj po punktach (desc)
        leaderboard.sort((a, b) => b.playerPoints - a.playerPoints);
        leaderboard.forEach((x, idx) => (x.playerPosition = idx + 1));
        return leaderboard;
    }

    async sendLeaderboard(gameId: string) {
        const leaderboard: ILeaderboardPlayer[] = await this.getLeaderboard(gameId);
        if (!leaderboard) return;
        socketService.Player.onGameLeaderboard({
            leaderboard,
            gameId,
            users: this.getPlayersList(gameId),
        });
    }

    async handleDisconnect(gameId: string, userId: string) {
        const game = this.games.get(gameId);
        if (!game) return;
        const player = game.players.find((x) => x.userId === userId);
        if (player) {
            player.disconnected = true;
            await this.redis.save(gameId, game);
        }
    }

    async endGame(gameId: string) {
        const game = await this.getGame(gameId);
        if (!game) return;
        await this.stopSubquestionTimer(gameId);
        const winnerFromLeaderboard = (await this.getLeaderboard(gameId))?.[0];
        if (winnerFromLeaderboard) {
            const gameDb = await gameService.DB.Find.byId(gameId);
            const winner = gameDb.players.find(({ _id }) => _id === winnerFromLeaderboard.playerId);

            await gameService.DB.update(gameId, {
                endedAt: new Date().toISOString(),
                status: ConstantsGame.Game.STATUS_ENUM.FINISHED,
                winnerPoints: winnerFromLeaderboard?.playerPoints || 0,
                winner,
            });
        }

        this.sendLeaderboard(gameId);
        socketService.Player.onGameEnded({ gameId });
        this.games.delete(gameId);
        await this.redis.delete(gameId);
    }

    setUserAvailable(userId: string) {
        if (!this.currentConnectedPlayers.has(userId)) this.currentConnectedPlayers.add(userId);
    }

    setUserNotAvailable(userId: string) {
        if (this.currentConnectedPlayers.has(userId)) this.currentConnectedPlayers.delete(userId);
    }

    getCurrentPlayedGamesIds(): string[] {
        return Array.from(this.games.keys());
    }
}

export function initializeGame() {
    gameManager = new GameManagerService();
    console.log('Game manager initialized...');
}
