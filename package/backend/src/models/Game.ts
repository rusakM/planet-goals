import { Schema, Document, model, Query } from 'mongoose';
import { TBasicAccount } from './Account';
import { ConstantsGame } from '../core/constants';
import { IPlayerGame } from './PlayerGame';

import { Helper } from '../shared/defs';
import { SchemasGlobal } from './';

export interface IGamePlayer extends TBasicAccount {
    joinedAt?: string;
    playerRole?: ConstantsGame.Game.PLAYER_ROLE;
}

const GamePlayerSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        email: String,
        firstName: String,
        joinedAt: String,
        lastName: String,
        playerRole: {
            type: String,
            enum: Object.keys(ConstantsGame.Game.PLAYER_ROLE),
            default: ConstantsGame.Game.PLAYER_ROLE.player,
        },
        role: String,
    },
    { _id: false }
);

interface IGameBasic {
    endedAt?: string;
    hostRole?: ConstantsGame.Game.PLAYER_ROLE;
    invitationCode?: string;
    lesson?: string;
    owner?: string;
    players?: IGamePlayer[];
    playerGames?: IPlayerGame[];
    singlePlayerMode?: boolean;
    startedAt?: string;
    status?: ConstantsGame.Game.STATUS_ENUM;
    winner?: IGamePlayer;
    winnerPoints?: number;
}

export interface IGame extends IGameBasic, SchemasGlobal.Schemas.IDocument {}
export interface IDBGame extends IGameBasic, Document {}

const gameSchema = new Schema<IDBGame>(
    {
        endedAt: String,
        hostRole: {
            type: String,
            enum: Object.keys(ConstantsGame.Game.PLAYER_ROLE),
            default: ConstantsGame.Game.PLAYER_ROLE.player,
        },
        invitationCode: String,
        lesson: {
            type: String,
            required: true,
        },
        owner: {
            type: String,
            required: true,
        },
        players: [GamePlayerSchema],
        singlePlayerMode: {
            type: Boolean,
            default: false,
        },
        startedAt: String,
        status: {
            type: String,
            enum: Object.keys(ConstantsGame.Game.STATUS_ENUM),
        },
        winner: GamePlayerSchema,
        winnerPoints: Number,
    },
    SchemasGlobal.Options.dbSchema
);

gameSchema.index({ invitationCode: 1, status: 1 });

gameSchema.virtual('playerGames', {
    ref: Helper.prepareTableName('player-game'),
    foreignField: 'gameId',
    localField: '_id',
});

gameSchema.pre(/^find/, function (this: Query<any, IDBGame>, next) {
    this.populate({
        path: 'playerGames',
        select: '-__v',
    });

    next();
});

export type TIndexes = 'invitationCode' | 'status';

export const Game = model<IDBGame>(Helper.prepareTableName('game'), gameSchema);
