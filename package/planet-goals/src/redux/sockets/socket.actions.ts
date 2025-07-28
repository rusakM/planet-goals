import * as socketTypes from "./socket.types";

export const socketConnect = (url: string) => ({ 
    type: socketTypes.SocketActionTypes.SOCKET_CONNECT, 
    payload: { url } 
});

export const socketDisconnect = () => ({ 
    type: socketTypes.SocketActionTypes.SOCKET_DISCONNECT 
});

export const socketEmit = (eventName: string, data?: unknown) => ({ 
    type: socketTypes.SocketActionTypes.SOCKET_EMIT, 
    payload: { eventName, data } 
});

export const gameEnded = (payload: socketTypes.IGameEnded) => ({ 
    type: socketTypes.SocketActionTypes.GAME_ENDED, 
    payload 
});

export const gameLeaderboard = (payload: socketTypes.IGameLeaderboard) => ({ 
    type: socketTypes.SocketActionTypes.GAME_LEADERBOARD, 
    payload 
});

export const gamePlayerGame = (payload: socketTypes.IGamePlayerGame) => ({ 
    type: socketTypes.SocketActionTypes.GAME_PLAYER_GAME, 
    payload 
});

export const gameSubquestion = (payload: socketTypes.IGameSubquestion) => ({
    type: socketTypes.SocketActionTypes.GAME_SUBQUESTION, 
    payload 
});

export const playerJoinGame = (payload: socketTypes.IJoinGame) => ({ 
    type: socketTypes.SocketActionTypes.PLAYER_JOIN_GAME, 
    payload 
});