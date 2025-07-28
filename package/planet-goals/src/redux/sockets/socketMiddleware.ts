import { Middleware } from "redux";
import socketService from "../../socket";
import * as socketActions from "./socket.actions";
import * as socketTypes from "./socket.types";
import { IAction } from "../store.types";


export const socketMiddleware: Middleware = store => next => 
  	(action: IAction<socketTypes.TConnect & socketTypes.TSocketEmit>)  => {
		switch (action.type) {
			case socketTypes.SocketActionTypes.SOCKET_CONNECT: {
				socketService.connect(action.payload?.url);

				socketService.on(socketTypes.SocketActionTypes.GAME_ENDED, (payload: socketTypes.IGameEnded) => {
					store.dispatch(socketActions.gameEnded(payload));
				});

				socketService.on(socketTypes.SocketActionTypes.GAME_LEADERBOARD, (payload: socketTypes.IGameLeaderboard) => {
					store.dispatch(socketActions.gameLeaderboard(payload));
				});

				socketService.on(socketTypes.SocketActionTypes.GAME_PLAYER_GAME, (payload: socketTypes.IGamePlayerGame) => {
					store.dispatch(socketActions.gamePlayerGame(payload));
				});

				socketService.on(socketTypes.SocketActionTypes.GAME_SUBQUESTION, (payload: socketTypes.IGameSubquestion) => {
					store.dispatch(socketActions.gameSubquestion(payload));
				});

				socketService.on(socketTypes.SocketActionTypes.PLAYER_JOIN_GAME, (payload: socketTypes.IJoinGame) => {
					store.dispatch(socketActions.playerJoinGame(payload));
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
