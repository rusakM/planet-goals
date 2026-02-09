import { Namespace, Server } from 'socket.io';
import { playerGameService, gameManagerService, accountService } from '../../services';
import { playerEmitter } from '../../services/socket.service';
import { debugMiddleware } from '../middleware/debug';
import { socketAuthMiddleware } from '../middleware/auth';
import { IExtendedSocket } from '../../shared/defs';
import * as playerTypes from '../types/player.types';
import { appSocket } from '../../shared/route';
import { ConstantsGame } from '../../core/constants';

function emitToGame(nsp: Namespace, users: string[], endpoint: string, payload: any) {
    for (const user of new Set(users)) {
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

    nsp.use(debugMiddleware);
    nsp.use(socketAuthMiddleware);
    setupOutcomeListeners(nsp);

    nsp.on('connection', (socket: IExtendedSocket) => {
        console.log('Player connected:', socket.data.decoded_token.id);
        socket.join(socket.data.decoded_token.id);
        gameManagerService.gameManager.setUserAvailable(socket.data.decoded_token.id);

        socket.on('joinGame', async ({ gameId, playerId, playerRole }: playerTypes.IJoinGame) => {
            console.log(`Join player ${playerId} to game ${gameId}`);
            if (!playerId || !gameId) {
                return;
            }
            let playerGame = gameManagerService.gameManager.getPlayerGame(gameId, playerId);
            const player = await accountService.DB.Find.byId(playerId);
            if (!playerGame) playerGame = (await playerGameService.DB.Find.byIndex('gameId', gameId))?.find((game) => game.playerId === playerId);
            const playerGameData: gameManagerService.IActivePlayer = {
                playerGame,
                playerRole: playerRole ?? ConstantsGame.Game.PLAYER_ROLE.player,
                userId: playerId,
                disconnected: false,
                firstName: player.firstName,
                lastName: player.lastName,
                email: player.email,
            };
            console.log('player role:', playerRole);
            socket.data = { playerId, gameId };
            await gameManagerService.gameManager.joinPlayer(player, gameId, playerGameData);
            console.log('Join player success');
        });

        socket.on('testSocket', (payload) => console.log('Test socket\n', 'incoming data:\n', payload));

        socket.on('disconnect', async (reason) => {
            const { gameId, userId } = socket.data || {};
            if (gameId && userId) {
                await gameManagerService.gameManager.handleDisconnect(gameId, userId);
            }
            gameManagerService.gameManager.setUserNotAvailable(userId);
            console.log('Player disconnected:', socket.id, reason);
        });
    });
};
