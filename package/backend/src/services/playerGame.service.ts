import { dbConnector } from '../core';
import * as errorsAdapter from '../core/errorAdapter';

import * as model from '../models/PlayerGame';
export import Model = model;

import { gameService, lessonService } from '.';
import { ConstantsGame } from '../core/constants';

class dbConnectorPlayerGame extends dbConnector<Model.IDBPlayerGame, Model.IPlayerGame, Model.TIndexes> {
    constructor() {
        super(Model.PlayerGame);
    }
}

export const DB = new dbConnectorPlayerGame();

export namespace Helpers {
    export function createPlayerGameByGameAndLesson(game: gameService.Model.IGame, lesson: lessonService.Model.ILesson, playerId: string): Model.IPlayerGame {
        const questionScores: model.IPlayerGame['questionScores'] = [];
        const gamePlayer = game.players.find((player) => player._id === playerId);
        for (const [index, question] of lesson.questions.entries()) {
            for (const [subIndex, subQuestion] of question.subquestions.entries()) {
                questionScores.push({
                    correctAnswer: subQuestion.correctAnswer,
                    points: 0,
                    question: index,
                    subquestion: subIndex,
                });
            }
        }

        return {
            gameId: game._id,
            isFinished: [ConstantsGame.Game.STATUS_ENUM.CANCELLED, ConstantsGame.Game.STATUS_ENUM.FINISHED].includes(game.status),
            joinedAt: gamePlayer.joinedAt,
            lessonId: game.lesson,
            playerId,
            playerRole: gamePlayer.playerRole,
            position: 0,
            questionScores,
            score: 0,
            singlePlayerMode: game.singlePlayerMode,
        };
    }
}
