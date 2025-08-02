import { Namespace, Server } from 'socket.io';
import { playerGameService, gameManagerService, accountService } from '../../services';
import { playerEmitter } from '../../services/socket.service';
import { socketAuthMiddleware } from '../middleware/auth';
import { IExtendedSocket } from 'src/shared/defs';
import * as playerTypes from '../types/player.types';
import { appSocket } from '../../shared/route';

function emitToGame(nsp: Namespace, users: string[], endpoint: string, payload: any) {
    for (const user of users) {
        nsp.to(user).emit(endpoint, payload);
    }
}

function setupOutcomeListeners(nsp: Namespace) {
    playerEmitter.on(appSocket.event.GAME_ENDED, ({ gameId }: playerTypes.IGameEnded) => {
        nsp.to(gameId).emit(appSocket.event.GAME_ENDED);
    });

    playerEmitter.on(appSocket.event.GAME_LEADERBOARD, ({ users, ...payload }: playerTypes.IGameLeaderboard) => {
        emitToGame(nsp, users, appSocket.event.GAME_LEADERBOARD, payload);
    });

    playerEmitter.on(appSocket.event.GAME_PLAYER_GAME, (payload: playerTypes.IGamePlayerGame) => {
        nsp.to(payload.userId).emit(appSocket.event.GAME_PLAYER_GAME, payload.playerGame);
    });

    playerEmitter.on(appSocket.event.GAME_PLAYER_DELETE, ({ users, ...payload }: playerTypes.IPlayerDelete) => {
        emitToGame(nsp, users, appSocket.event.GAME_PLAYER_DELETE, payload);
    });

    playerEmitter.on(appSocket.event.GAME_PLAYER_JOIN, ({ users, ...payload }: playerTypes.IPlayerJoin) => {
        emitToGame(nsp, users, appSocket.event.GAME_PLAYER_JOIN, payload);
    });

    playerEmitter.on(appSocket.event.GAME_START, ({ users, ...payload }: playerTypes.IGameStart) => {
        emitToGame(nsp, users, appSocket.event.GAME_START, payload);
    });

    playerEmitter.on(appSocket.event.GAME_SUBQUESTION, ({ users, ...payload }: playerTypes.IGameSubquestion) => {
        emitToGame(nsp, users, appSocket.event.GAME_SUBQUESTION, payload);
    });
}

export const registerPlayerNamespace = (io: Server) => {
    const nsp = io.of(appSocket.namespace.PLAYER);

    nsp.use(socketAuthMiddleware);
    setupOutcomeListeners(nsp);

    nsp.on('connection', (socket: IExtendedSocket) => {
        console.log('Player connected:', socket.id);
        socket.join(socket.data.decoded_token.id);

        socket.on(appSocket.event.PLAYER_JOIN_GAME, async ({ gameId, playerId }: playerTypes.IJoinGame, cb) => {
            if (!playerId || !gameId) {
                cb && cb({ err: 'Brak userId lub gameId' });
                return;
            }
            let playerGame = gameManagerService.gameManager.getPlayerGame(gameId, playerId);
            const player = await accountService.DB.Find.byId(playerId);
            if (!playerGame) playerGame = (await playerGameService.DB.Find.byMultipleKeys({ gameId, playerId }))?.[0];
            if (!playerGame) {
                cb && cb({ err: 'Nie znaleziono PlayerGame' });
                return;
            }
            socket.join(gameId);
            socket.data = { playerId, gameId };
            const error = gameManagerService.gameManager.joinPlayer(player, socket.id, playerGame);
            if (error) {
                cb && cb({ err: error });
                return;
            }
            const current = gameManagerService.gameManager.getCurrentSubquestion(gameId);
            cb && cb({ ok: true, currentSubquestion: current });
        });

        socket.on('disconnect', (reason) => {
            const { gameId, userId } = socket.data || {};
            if (gameId && userId) {
                gameManagerService.gameManager.handleDisconnect(gameId, userId);
            }
            console.log('Player disconnected:', socket.id, reason);
        });
    });
};
