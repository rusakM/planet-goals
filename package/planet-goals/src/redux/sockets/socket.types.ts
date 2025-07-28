import { ILeaderboardPlayer, IPlayerGame } from "../../types/game";

export const SocketActionTypes = {
    GAME_ENDED: 'game:ended',
    GAME_LEADERBOARD: 'game:leaderboard',
    GAME_PLAYER_GAME: 'game:playerGame',
    GAME_SUBQUESTION: 'game:subquestion',
    PLAYER_JOIN_GAME: 'join_game',
    SOCKET_CONNECT: "socket/connect",
    SOCKET_DISCONNECT: "socket/disconnect",
    SOCKET_EMIT: "socket/emit",
}

export interface IGameEnded {
  gameId: string;
}

export interface IGameLeaderboard {
  gameId: string;
  leaderboard: ILeaderboardPlayer[];
}

export interface IGamePlayerGame {
  userId: string;
  playerGame: IPlayerGame;
}

export interface IGameSubquestion {
  gameId: string;
  question: number;
  subquestion: number;
}

export interface IJoinGame {
  gameId: string;
  playerId: string;
}

export type TConnect = { 
    url: string 
};

export type TSocketEmit = { 
    eventName: string, data: unknown 
};
