import * as socketTypes from "./socket.types";

export const socketConnect = (url: string, namespace: string) => ({ 
    type: socketTypes.SocketActionTypes.SOCKET_CONNECT, 
    payload: { url, namespace } 
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

export const gameStart = (payload: socketTypes.IGameStart) => ({
    type: socketTypes.SocketActionTypes.GAME_START,
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

export const playerJoinGame = (payload: socketTypes.IPlayerJoin) => ({ 
    type: socketTypes.SocketActionTypes.GAME_PLAYER_JOIN, 
    payload 
});

export const playerDeleted = (payload: socketTypes.IPlayerDelete) => ({
    type: socketTypes.SocketActionTypes.GAME_PLAYER_DELETE,
    payload
});

