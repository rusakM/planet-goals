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
    userId: string;
    socketId: string;
    playerGame: playerGameService.Model.IPlayerGame;
    disconnected?: boolean;
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
    started: boolean;
    startTime: number | null;
    // kiedy timeout się skończy (ms)
    subquestionEndTime: number | null;
    // KEY: userId, VALUE: odpowiedzi i scoring na konkrentne subquestion
    answers: { [userId: string]: { [q: number]: { [sq: number]: { answer: string; points: number; responseTime: number } } } };
    // do obsługi timeoutów per subquestion
    subquestionTimer?: NodeJS.Timeout;
    // KNOWN issues: przy reconnect musimy dla danego usera "dociągnąć" playerGame z DB
    stage: ConstantsGame.Game.STAGE_ENUM;
}

export let gameManager: GameManagerService;

class GameManagerService {
    /**
     * gameId -> GameState
     */
    private games: Map<string, IGameState> = new Map();
    private redis: RedisConnector<IGameState>;

    constructor() {
        this.redis = new RedisConnector<IGameState>('live_games', 24 * 60 * 60);
        setTimeout(() => this.init(), 1500);
    }

    public async init() {
        const allGames = await this.redis.getAll();
        allGames.forEach((game) => {
            this.games.set(game.gameId, game);
            this.broadcastSubquestion(game.gameId);
        });
    }

    /**
     * Inicjalizuje nową grę w silniku, po wywołaniu startGame
     */
    initializeGame(game: gameService.Model.IGame, lesson: lessonService.Model.ILesson, playerGames: playerGameService.Model.IPlayerGame[]) {
        console.log(`Initialize game, ${game._id} with lesson: ${lesson._id}`);
        const questions = lesson.questions ?? [];
        const stage = questions[0]?.gameStage ?? ConstantsGame.Game.STAGE_ENUM.QUICK_CONTENT;
        const state: IGameState = {
            gameId: game._id,
            lesson,
            questions,
            players: playerGames.map((pg) => ({
                userId: pg.playerId,
                socketId: '',
                playerGame: pg,
                disconnected: true,
                playerRole: pg.playerRole,
            })),
            currentQuestionIndex: 0,
            currentSubquestionIndex: 0,
            started: false,
            startTime: null,
            subquestionEndTime: null,
            answers: {},
            subquestionTimer: undefined,
            stage,
        };
        this.games.set(game._id, state);
        this.redis.saveHash(game._id, state);
    }

    startGame(gameId: string) {
        const game = this.games.get(gameId);
        if (!game) {
            console.log(`No game with id: ${gameId}`);
            return null;
        }
        if (game.started) {
            return game;
        }
        game.started = true;
        game.startTime = Date.now();
        this.redis.saveHash(gameId, game);
        socketService.Player.onGameStart({ gameId, users: this.getPlayersList(gameId) });

        setTimeout(() => {
            this.broadcastSubquestion(gameId);

            const currentInfo = this.getCurrentSubquestion(gameId);
            const subq = currentInfo?.subquestion;
            if (subq?.timeInSek && game.stage !== ConstantsGame.Game.STAGE_ENUM.COMPETITION) {
                this.startSubquestionTimer(gameId, subq.timeInSek);
            }
            this.redis.saveHash(gameId, this.games.get(gameId)!);
        }, 10000);

        return game;
    }

    /**
     * Dołącz użytkownika do gry przez websocket, rejestrując jego socket, odsyłając aktualny subquestion.
     * @returns null lub error jeśli nie można dołączyć (np. gra skończona)
     */
    joinPlayer(user: accountService.Model.IAccount, socketId: string, playerGame: playerGameService.Model.IPlayerGame) {
        const { gameId, playerRole, playerId } = playerGame;
        const game = this.games.get(playerGame.gameId);
        if (!game) return 'NO_GAME';
        // Można dodać logikę blokowania dołączenia kiedy gra jest zakończona
        const existing = game.players.find((x) => x.userId === playerId);
        if (existing) {
            existing.socketId = socketId;
            existing.disconnected = false;
        } else {
            game.players.push({ userId: playerId, socketId, playerGame });
        }
        if (!game.started) {
            const users = game.players.map(({ userId }) => userId);
            socketService.Player.onPlayerJoin({
                _id: playerId,
                email: user.email,
                firstName: user.firstName,
                lastNAme: user.lastName,
                role: playerRole,
                users,
            });
        }
        this.redis.saveHash(gameId, game);
        this.sendPlayerGameToUser(gameId, playerId);
        return null;
    }

    deletePlayer(playerId: string, gameId: string) {
        const game = this.games.get(gameId);
        if (!game) return;
        const playerGameIdx = game.players.findIndex(({ userId }) => userId === playerId);
        if (playerGameIdx < 0) return;
        game.players.splice(playerGameIdx, 1);
        this.redis.saveHash(gameId, game);
        socketService.Player.onPlayerDelete({ users: this.getPlayersList(gameId), playerId });
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
    processAnswer(gameId: string, userId: string, answer: string, responseTime: number): { points: number; correct: boolean; done: boolean; error?: string } {
        const game = this.games.get(gameId);
        if (!game) return { points: 0, correct: false, done: false, error: 'NO_GAME' };

        const q = game.questions[game.currentQuestionIndex];
        if (!q) return { points: 0, correct: false, done: false, error: 'NO_QUESTION' };
        const sq = q.subquestions?.[game.currentSubquestionIndex];
        if (!sq) return { points: 0, correct: false, done: false, error: 'NO_SUBQUESTION' };
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
        } else if (game.stage === ConstantsGame.Game.STAGE_ENUM.KNOWLEDGE) {
            correct = answer === sq.correctAnswer;
            // Avoid division by 0:
            const subsLen = q.subquestions?.length || 1;
            points = correct ? (q.maxPoints || 0) / subsLen : 0;
        } else if (game.stage === ConstantsGame.Game.STAGE_ENUM.COMPETITION) {
            // Zapisywanie odpowiedzi, ale punkty ustalimy po zakończeniu subquestion
            correct = answer === sq.correctAnswer;
            // Competition calculation handled elsewhere
        }
        game.answers[userId][game.currentQuestionIndex][game.currentSubquestionIndex] = { answer, points, responseTime };
        this.redis.saveHash(gameId, game);
        return { points, correct, done: true };
    }

    /**
     * Uruchamia timeout, po którym automatycznie zmieniana jest subquestion (oraz przyznaje tym co nie odpowiedzieli punkty=0).
     * Wywołuj zawsze po wysłaniu nowego subquestion do graczy.
     */
    startSubquestionTimer(gameId: string, seconds: number) {
        const game = this.games.get(gameId);
        if (!game) return;
        this.stopSubquestionTimer(gameId);
        game.subquestionEndTime = Date.now() + seconds * 1000;
        game.subquestionTimer = setTimeout(() => this.nextSubquestion(gameId), seconds * 1000);
        this.redis.saveHash(gameId, game);
    }

    stopSubquestionTimer(gameId: string) {
        const game = this.games.get(gameId);
        if (game?.subquestionTimer) {
            clearTimeout(game.subquestionTimer);
            game.subquestionTimer = undefined;
            this.redis.saveHash(gameId, game);
        }
    }

    /**
     * Przechodzi do kolejnego subquestion w lekcji. Jeśli skończone → kończy grę i rozsyła leaderboard.
     */
    nextSubquestion(gameId: string) {
        const game = this.games.get(gameId);
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
        }
        if (nq >= game.questions.length) {
            // End game
            this.endGame(gameId);
            return;
        }
        game.currentQuestionIndex = nq;
        game.currentSubquestionIndex = ns;
        // Zmień stage jeśli potrzeba:
        game.stage = game.questions[nq]?.gameStage ?? game.stage;
        this.broadcastSubquestion(gameId);
        // Ustal timeout dla nowych subquestions
        const nextSq: lessonService.Model.ISubquestion | undefined = game.questions[nq]?.subquestions?.[ns];
        if (nextSq?.timeInSek && game.stage !== ConstantsGame.Game.STAGE_ENUM.COMPETITION) {
            this.startSubquestionTimer(gameId, nextSq.timeInSek);
        }
        this.redis.saveHash(gameId, game);
    }

    /**
     * Wysyła aktualny subquestion do wszystkich graczy w pokoju (Socket.io room)
     */
    broadcastSubquestion(gameId: string) {
        const info = this.getCurrentSubquestion(gameId);
        if (!info) return;
        socketService.Player.onGameSubquestion({
            question: info.qIndex,
            subquestion: info.sqIndex,
            gameId,
            users: this.getPlayersList(gameId),
        });
    }

    /**
     * Wysyła stan gry (playerGame/points itp.) do danego usera (np. po reconnect itp.)
     */
    sendPlayerGameToUser(gameId: string, userId: string) {
        const game = this.games.get(gameId);
        if (!game) return;
        const player = game.players.find((x) => x.userId === userId);
        if (player?.socketId) {
            socketService.Player.onPlayerGame({
                playerGame: player.playerGame,
                userId,
            });
        }
    }

    /**
     * Wysyła leaderboard po zakończeniu gry, oraz ustawia grę jako "skończoną" (nie można joinować!)
     */
    getLeaderboard(gameId: string) {
        const game = this.games.get(gameId);
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
                playerLastName: (p.playerGame as any)?.playerLastName || '',
                playerName: (p.playerGame as any)?.playerName || '',
                playerPoints: points,
                playerPosition: idx + 1,
                playerRole: p.playerGame.playerRole,
            };
        });
        // Sortuj po punktach (desc)
        leaderboard.sort((a, b) => b.playerPoints - a.playerPoints);
        leaderboard.forEach((x, idx) => (x.playerPosition = idx + 1));
        return leaderboard;
    }

    sendLeaderboard(gameId: string) {
        const game = this.games.get(gameId);
        if (!game) return;
        // Licz punkty dla każdego gracza
        const leaderboard: ILeaderboardPlayer[] = this.getLeaderboard(gameId);
        socketService.Player.onGameLeaderboard({
            leaderboard,
            gameId,
            users: this.getPlayersList(gameId),
        });
    }

    handleDisconnect(gameId: string, userId: string) {
        const game = this.games.get(gameId);
        if (!game) return;
        const player = game.players.find((x) => x.userId === userId);
        if (player) {
            player.disconnected = true;
            this.redis.saveHash(gameId, game);
        }
    }

    async endGame(gameId: string) {
        const game = this.games.get(gameId);
        if (!game) return;
        this.stopSubquestionTimer(gameId);
        const winnerFromLeaderboard = this.getLeaderboard(gameId)?.[0];
        let winner: gameService.Model.IGamePlayer;
        if (winnerFromLeaderboard) {
            const gameDb = await gameService.DB.Find.byId(gameId);
            winner = gameDb.players.find(({ _id }) => _id === winnerFromLeaderboard.playerId);
        }

        await gameService.DB.update(gameId, {
            endedAt: new Date().toISOString(),
            status: ConstantsGame.Game.STATUS_ENUM.FINISHED,
            winnerPoints: winnerFromLeaderboard.playerPoints,
            winner,
        });

        this.sendLeaderboard(gameId);
        socketService.Player.onGameEnded({ gameId });
        this.games.delete(gameId);
        this.redis.delete(gameId);
    }
}

export function initializeGame() {
    gameManager = new GameManagerService();
    console.log('Game manager initialized...');
}
