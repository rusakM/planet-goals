import { EventEmitter } from 'events';
import { appSocket } from '../shared/route';
import * as playerTypes from '../sockets/types/player.types';

export const playerEmitter = new EventEmitter().setMaxListeners(50);

export namespace Player {
    export function onGameEnded(payload: playerTypes.IGameEnded) {
        playerEmitter.emit(appSocket.event.GAME_ENDED, payload);
    }

    export function onGameLeaderboard(payload: playerTypes.IGameLeaderboard) {
        playerEmitter.emit(appSocket.event.GAME_LEADERBOARD, payload);
    }

    export function onGameSubquestion(payload: playerTypes.IGameSubquestion) {
        playerEmitter.emit(appSocket.event.GAME_SUBQUESTION, payload);
    }

    export function onPlayerGame(payload: playerTypes.IGamePlayerGame) {
        playerEmitter.emit(appSocket.event.GAME_PLAYER_GAME, payload);
    }
}
