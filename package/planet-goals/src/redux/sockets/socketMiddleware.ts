import { Middleware, MiddlewareAPI, ActionCreator } from "redux";
import socketService from "../../socket";
import * as socketActions from "./socket.actions";
import * as socketTypes from "./socket.types";
import { IAction, IStore } from "../store.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useValidateGameId<T extends socketTypes.IBasicGameSocketType>(store: MiddlewareAPI, dispatchAction: ActionCreator<any>, payload: T) {
	const state: IStore = store.getState();

	if (state?.game?.currentGame?._id === payload?.gameId) {
		store.dispatch(dispatchAction(payload));
	}
}

export const socketMiddleware: Middleware = store => next => 
  	(action: IAction<socketTypes.TConnect & socketTypes.TSocketEmit>)  => {
		switch (action.type) {
			case socketTypes.SocketActionTypes.SOCKET_CONNECT: {
				socketService.connect(action.payload?.url, action.payload?.namespace);

				socketService.on(socketTypes.SocketActionTypes.GAME_ENDED, (payload: socketTypes.IGameEnded) => {
					useValidateGameId(store, socketActions.gameEnded, payload);
				});

				socketService.on(socketTypes.SocketActionTypes.GAME_LEADERBOARD, (payload: socketTypes.IGameLeaderboard) => {
					useValidateGameId(store, socketActions.gameLeaderboard, payload);
				});

				socketService.on(socketTypes.SocketActionTypes.GAME_PLAYER_GAME, (payload: socketTypes.IGamePlayerGame) => {
					useValidateGameId(store, socketActions.gamePlayerGame, payload);
				});

				socketService.on(socketTypes.SocketActionTypes.GAME_START, (payload: socketTypes.IGameStart) => {
					useValidateGameId(store, socketActions.gameStart, payload);
				});

				socketService.on(socketTypes.SocketActionTypes.GAME_SUBQUESTION, (payload: socketTypes.IGameSubquestion) => {
					useValidateGameId(store, socketActions.gameSubquestion, payload);
				});

				socketService.on(socketTypes.SocketActionTypes.GAME_PLAYER_DELETE, (payload: socketTypes.IPlayerDelete) => {
					useValidateGameId(store, socketActions.playerDeleted, payload);
				});

				socketService.on(socketTypes.SocketActionTypes.GAME_PLAYER_JOIN, (payload: socketTypes.IPlayerJoin) => {
					useValidateGameId(store, socketActions.playerJoinGame, payload);
				});

				break;
			}
			case socketTypes.SocketActionTypes.SOCKET_DISCONNECT: {
				socketService.disconnect();
				break;
			}
			case socketTypes.SocketActionTypes.SOCKET_EMIT: {
				const { eventName, data } = action.payload;
				socketService.emit(eventName, data);
				break;
			}
    	}
    	return next(action);
};
