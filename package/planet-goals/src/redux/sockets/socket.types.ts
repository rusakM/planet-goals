import { ILeaderboardPlayer, IPlayerGame } from "../../types/game";
import { gameTypes } from "../../types";

export const SocketActionTypes = {
	GAME_ENDED: 'game:ended',
	GAME_LEADERBOARD: 'game:leaderboard',
	GAME_PLAYER_GAME: 'game:playerGame',
	GAME_PLAYER_DELETE: 'game:playerDelete',
	GAME_PLAYER_JOIN: 'game:playerJoin',
	GAME_START: 'game:start',
	GAME_SUBQUESTION: 'game:subquestion',
	PLAYER_JOIN_GAME: 'joinGame',
	SOCKET_CONNECT: "socket/connect",
	SOCKET_DISCONNECT: "socket/disconnect",
	SOCKET_EMIT: "socket/emit",
}

export interface IBasicGameSocketType { 
	gameId: string 
}

export type IGameEnded = IBasicGameSocketType

export interface IGameLeaderboard extends IBasicGameSocketType {
	leaderboard: ILeaderboardPlayer[];
}

export interface IGamePlayerGame extends IBasicGameSocketType {
	userId: string;
	playerGame: IPlayerGame;
}

export interface IGameSubquestion extends IBasicGameSocketType {
	question: number;
	subquestion: number;
}

export interface IJoinGame extends IBasicGameSocketType {
	playerId: string;
}

export type IGameStart = IBasicGameSocketType;

export interface IPlayerDelete extends IBasicGameSocketType	{
	playerId: string;
}

export interface IPlayerJoin extends IBasicGameSocketType {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: gameTypes.TPlayerRole;
}

export type TConnect = { 
	namespace: string,
	url: string,
};

export type TSocketEmit = { 
	eventName: string, data: unknown 
};
