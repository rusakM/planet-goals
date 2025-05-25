import { Schema, Document, model } from 'mongoose';

import { Helper } from '../shared/defs';
import { SchemasGlobal } from '.';
import { ConstantsGame } from '../core/constants';

interface IQuestionScore {
    correctAnswer?: string;
    points?: number;
    question?: number;
    respondAt?: string;
    response?: string;
    responseTime?: number;
    subquestion?: number;
}

interface IPlayerGameBasic {
    gameId?: string;
    isFinished?: boolean;
    joinedAt?: string;
    lessonId?: string;
    playerId?: string;
    position?: number;
    questionScores?: IQuestionScore[];
    score?: number;
    singlePlayerMode?: boolean;
}

export interface IPlayerGame extends IPlayerGameBasic, SchemasGlobal.Schemas.IDocument {}
export interface IDBPlayerGame extends IPlayerGameBasic, Document {}

const PlayerGameSchema = new Schema<IDBPlayerGame>(
    {
        gameId: {
            type: String,
            required: true,
        },
        isFinished: {
            type: Boolean,
            default: false,
        },
        joinedAt: String,
        lessonId: {
            type: String,
            required: true,
        },
        playerId: {
            type: String,
            required: true,
        },
        position: Number,
        questionScores: [
            {
                correctAnswer: String,
                points: {
                    type: Number,
                    default: 0,
                },
                question: Number,
                respondAt: String,
                response: String,
                responseTime: String,
                subquestion: Number,
            },
        ],
        score: {
            type: Number,
            default: 0,
        },
        singlePlayerMode: {
            type: Boolean,
            default: false,
        },
    },
    SchemasGlobal.Options.dbSchema
);

PlayerGameSchema.index({ gameId: -1, createdAt: -1 });
PlayerGameSchema.index({ lessonId: 1 });
PlayerGameSchema.index({ playerId: 1 });

export type TIndexes = 'gameId' | 'lessonId' | 'playerId';

export const PlayerGame = model<IDBPlayerGame>(Helper.prepareTableName('player-game'), PlayerGameSchema);
