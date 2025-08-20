import { Request, Response, Router } from 'express';
import { NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { appResponse, appRoute } from '../shared/route';
import { security } from '../shared/security';
import { accountService, gameManagerService, gameService, lessonService, playerGameService } from '../services';
import { ConstantsGame, ConstantsGlobal } from '../core/constants';
import * as errorsAdapter from '../core/errorAdapter';
import { validateAnswer } from '../middlewares/validators/game';
import { useRequestTime } from '../middlewares/requestTime';

interface IAnswerRequest {
    lessonId: string;
    questionNumber: number;
    subquestionNumber: number;
    answer: string;
    questionType: ConstantsGame.Question.TYPES_ENUM;
}

async function createGame(req: Request, res: Response) {
    const { userId, role } = req.params;
    const player = await accountService.DB.Find.byId(userId);
    const { hostRole, lesson, singlePlayerMode } = req.body;
    let invitationCode;
    let gamesWithCodeLength = 1;

    do {
        invitationCode = uuidv4().slice(-5).toUpperCase();
        gamesWithCodeLength = (await gameService.DB.Find.byIndex('invitationCode', invitationCode))?.length;
    } while (gamesWithCodeLength > 0);

    const [newGame, lessonData] = await Promise.all([
        gameService.DB.create({
            hostRole,
            invitationCode,
            lesson,
            owner: userId,
            singlePlayerMode,
            status: ConstantsGame.Game.STATUS_ENUM.CREATED,
            players: [
                {
                    email: player.email,
                    firstName: player.firstName,
                    lastName: player.lastName,
                    playerRole: hostRole,
                    role: player.role,
                    _id: player._id,
                },
            ],
        }),
        lessonService.DB.Find.byId(lesson),
    ]);

    await gameManagerService.gameManager.initializeGame(newGame, lessonData, []);
    appResponse.prepareJsonResponse(res, newGame);
}

async function joinGame(req: Request, res: Response) {
    const { userId } = req.params;
    const role = req.params.role as ConstantsGlobal.Account.ROLES_ENUM;
    const { invitationCode }: { invitationCode: string } = req.body;
    let playerRole = req.body.playerRole;
    if (!playerRole || role === ConstantsGlobal.Account.ROLES_ENUM.STUDENT) playerRole = ConstantsGame.Game.PLAYER_ROLE.player;
    const user = await accountService.DB.Find.byId(userId);
    if (!user) throw errorsAdapter.Global.createError(errorsAdapter.Global.ErrorsEnum.USER_NOT_FOUND);

    let game = await gameService.DB.Find.byIndex('invitationCode', invitationCode, 1);
    if (!game || [ConstantsGame.Game.STATUS_ENUM.FINISHED, ConstantsGame.Game.STATUS_ENUM.CANCELLED].includes(game.status)) {
        throw errorsAdapter.Game.createError(errorsAdapter.Game.ErrorsEnum.GAME_NOT_FOUND);
    }

    const { players } = game;
    const joinedPlayer = players?.find(({ _id }) => _id.toString() === userId);
    if (!joinedPlayer) {
        players.push({
            _id: userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.lastName,
            joinedAt: new Date().toISOString(),
            playerRole,
            role,
        });

        if (game.status === ConstantsGame.Game.STATUS_ENUM.STARTED) {
            const lesson = await lessonService.DB.Find.byId(game.lesson);
            const playerGameData = playerGameService.Helpers.createPlayerGameByGameAndLesson(game, lesson, userId);
            await playerGameService.DB.create(playerGameData);
        }

        await gameService.DB.update(game._id, { players });
    }

    appResponse.prepareJsonResponse(res, {
        ...game,
    });
}

async function startGame(req: Request, res: Response) {
    const { userId, gameId } = req.params;
    let game = await gameService.DB.Find.byId(gameId);
    if (!game) throw errorsAdapter.Game.createError(errorsAdapter.Game.ErrorsEnum.GAME_NOT_FOUND);
    if (game.owner !== userId) throw errorsAdapter.Global.createError(errorsAdapter.Global.ErrorsEnum.INSUFFICIENT_PERMISSIONS);
    if (!game.singlePlayerMode && game.players?.length < 2) throw errorsAdapter.Game.createError(errorsAdapter.Game.ErrorsEnum.TOO_LITTLE_PLAYERS_LIST);

    game = await gameService.DB.update(gameId, {
        startedAt: new Date().toISOString(),
        status: ConstantsGame.Game.STATUS_ENUM.STARTED,
    });
    const lesson = await lessonService.DB.Find.byId(game.lesson);

    let playerGames: playerGameService.Model.IPlayerGame[] = game.players.map((player) => playerGameService.Helpers.createPlayerGameByGameAndLesson(game, lesson, player._id));

    playerGames = await playerGameService.DB.createMany(playerGames);
    await gameManagerService.gameManager.initializeGame(game, lesson, playerGames);

    appResponse.prepareJsonResponse(res, {
        ...game,
        playerGames,
    });
}

async function removePlayer(req: Request, res: Response) {
    const { userId, gameId, playerId } = req.params;
    let game = await gameService.DB.Find.byId(gameId);
    let playerGames: playerGameService.Model.IPlayerGame[];
    if (!game) throw errorsAdapter.Game.createError(errorsAdapter.Game.ErrorsEnum.GAME_NOT_FOUND);
    if (game.owner !== userId || playerId === userId) throw errorsAdapter.Global.createError(errorsAdapter.Global.ErrorsEnum.INSUFFICIENT_PERMISSIONS);

    const players = game.players.filter(({ _id }) => _id.toString() !== playerId);
    [game, playerGames] = await Promise.all([gameService.DB.update(gameId, { players }), playerGameService.DB.Find.byMultipleKeys({ gameId })]);
    const playerGame = playerGames?.find((pGame) => pGame.playerId === playerId);
    playerGames = playerGames.filter(({ _id }) => _id !== playerGame._id);
    await Promise.all([
        async () => {
            if (playerGame?._id) await playerGameService.DB.delete(playerGame?._id);
        },
        gameManagerService.gameManager.deletePlayer(playerId, gameId),
    ]);

    appResponse.prepareJsonResponse(res, {
        ...game,
    });
}

async function sendAnswer(req: Request, res: Response) {
    const { userId, gameId, requestTime } = req.params;
    const answerData = req.body as IAnswerRequest;

    const game = await gameService.DB.Find.byId(gameId);
    if (!game) {
        throw errorsAdapter.Game.createError(errorsAdapter.Game.ErrorsEnum.GAME_NOT_FOUND);
    }
    if (game.status !== ConstantsGame.Game.STATUS_ENUM.STARTED) {
        throw errorsAdapter.Game.createError(errorsAdapter.Game.ErrorsEnum.GAME_NOT_STARTED);
    }

    const playerGame = await playerGameService.DB.Find.byMultipleKeys({
        gameId,
        playerId: userId,
        lessonId: answerData.lessonId,
    });

    if (!playerGame || playerGame.length === 0) {
        throw errorsAdapter.Game.createError(errorsAdapter.Game.ErrorsEnum.PLAYER_GAME_NOT_FOUND);
    }

    const currentPlayerGame = playerGame[0];

    const newQuestionScore = {
        question: answerData.questionNumber,
        subquestion: answerData.subquestionNumber,
        response: answerData.answer,
        respondAt: new Date().toISOString(),
        points: 0,
    };

    const questionScores = currentPlayerGame.questionScores || [];
    const existingScoreIndex = questionScores.findIndex((qs) => qs.question === answerData.questionNumber && qs.subquestion === answerData.subquestionNumber);

    if (existingScoreIndex !== -1) {
        questionScores[existingScoreIndex] = { ...questionScores[existingScoreIndex], ...newQuestionScore };
    } else {
        questionScores.push(newQuestionScore);
    }

    const updatedPlayerGame = await playerGameService.DB.update(currentPlayerGame._id, {
        questionScores,
    });

    await gameManagerService.gameManager.processAnswer(gameId, userId, answerData.answer, new Date(requestTime).getTime());

    appResponse.prepareJsonResponse(res, updatedPlayerGame);
}

export default function setup(router: Router) {
    router.delete(appRoute.getMap().game.removePlayer, security.validateParams, security.validateAuthenticatedRequest, removePlayer);
    router.post(appRoute.getMap().game.create, security.validateAuthenticatedRequest, createGame);
    router.post(appRoute.getMap().game.join, security.validateAuthenticatedRequest, joinGame);
    router.patch(appRoute.getMap().game.start, security.validateParams, security.validateAuthenticatedRequest, startGame);
    router.post(appRoute.getMap().game.sendAnswer, useRequestTime, security.validateParams, security.validateAuthenticatedRequest, validateAnswer, sendAnswer);
}
