import { gameManagerService, playerGameService } from '../../services';

export interface IGameEnded {
    gameId: string;
}

export interface IGameLeaderboard {
    gameId: string;
    leaderboard: gameManagerService.ILeaderboardPlayer[];
}

export interface IGamePlayerGame {
    userId: string;
    playerGame: playerGameService.Model.IPlayerGame;
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
