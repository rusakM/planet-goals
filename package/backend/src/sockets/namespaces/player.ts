import { Namespace, Server } from 'socket.io';
import { playerGameService, gameManagerService } from '../../services';
import { playerEmitter } from '../../services/socket.service';
import { socketAuthMiddleware } from '../middleware/auth';
import { IExtendedSocket } from 'src/shared/defs';
import * as playerTypes from '../types/player.types';
import { appSocket } from '../../shared/route';

function setupOutcomeListeners(nsp: Namespace) {
    playerEmitter.on(appSocket.event.GAME_ENDED, ({ gameId }: playerTypes.IGameEnded) => {
        nsp.to(gameId).emit(appSocket.event.GAME_ENDED);
    });

    playerEmitter.on(appSocket.event.GAME_LEADERBOARD, ({ gameId, leaderboard }: playerTypes.IGameLeaderboard) => {
        nsp.to(gameId).emit(appSocket.event.GAME_LEADERBOARD, leaderboard);
    });

    playerEmitter.on(appSocket.event.GAME_PLAYER_GAME, (payload: playerTypes.IGamePlayerGame) => {
        nsp.to(payload.userId).emit(appSocket.event.GAME_PLAYER_GAME, payload.playerGame);
    });

    playerEmitter.on(appSocket.event.GAME_SUBQUESTION, (payload: playerTypes.IGameSubquestion) => {
        nsp.to(payload.gameId).emit(appSocket.event.GAME_SUBQUESTION, payload);
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
            if (!playerGame) playerGame = (await playerGameService.DB.Find.byMultipleKeys({ gameId, playerId }))?.[0];
            if (!playerGame) {
                cb && cb({ err: 'Nie znaleziono PlayerGame' });
                return;
            }
            socket.join(gameId);
            socket.data = { playerId, gameId };
            const error = gameManagerService.gameManager.joinPlayer(gameId, playerId, socket.id, playerGame);
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
