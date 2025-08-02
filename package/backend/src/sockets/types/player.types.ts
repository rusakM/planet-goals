import { gameManagerService, playerGameService } from '../../services';
import { ConstantsGame } from '../../core/constants';

export interface IGameEmittedSocket {
    users?: string[];
}

export interface IGameEnded {
    gameId: string;
}

export interface IGameLeaderboard extends IGameEmittedSocket {
    gameId: string;
    leaderboard: gameManagerService.ILeaderboardPlayer[];
}

export interface IGamePlayerGame {
    userId: string;
    playerGame: playerGameService.Model.IPlayerGame;
}

export interface IGameStart extends IGameEmittedSocket {
    gameId: string;
}

export interface IGameSubquestion extends IGameEmittedSocket {
    gameId: string;
    question: number;
    subquestion: number;
}

export interface IPlayerDelete extends IGameEmittedSocket {
    playerId: string;
}

export interface IPlayerJoin extends IGameEmittedSocket {
    _id: string;
    firstName: string;
    lastNAme: string;
    email: string;
    role: ConstantsGame.Game.PLAYER_ROLE;
}

export interface IJoinGame {
    gameId: string;
    playerId: string;
}
