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

    export function onGameStart(payload: playerTypes.IGameStart) {
        playerEmitter.emit(appSocket.event.GAME_START, payload);
    }

    export function onPlayerGame(payload: playerTypes.IGamePlayerGame) {
        playerEmitter.emit(appSocket.event.GAME_PLAYER_GAME, payload);
    }

    export function onPlayerDelete(payload: playerTypes.IPlayerDelete) {
        playerEmitter.emit(appSocket.event.GAME_PLAYER_DELETE, payload);
    }

    export function onPlayerJoin(payload: playerTypes.IPlayerJoin) {
        playerEmitter.emit(appSocket.event.GAME_PLAYER_JOIN, payload);
    }
}
