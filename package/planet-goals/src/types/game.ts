import { globalTypes, userTypes } from ".";

export type TGameMode = "multi" | "single";
export type TGameStage = "game" | "join" | "lobby" | "selectGameMode" | "selectLesson" | "wait";
export type TPlayerRole = "player" | "spectator";

export enum GAME_PLAY_STAGE_ENUM {
    COMPETITION = 'COMPETITION',
    FINAL = 'FINAL', // not for questions
    KNOWLEDGE = 'KNOWLEDGE',
    QUICK_CONTENT = 'QUICK_CONTENT',
}

export enum STATUS_ENUM {
    CREATED = 'CREATED',
    STARTED = 'STARTED',
    CANCELLED = 'CANCELLED',
    FINISHED = 'FINISHED',
}

// GamePlay

export interface IQuestionScore {
    correctAnswer?: string;
    points?: number;
    question?: number;
    respondAt?: string;
    response?: string;
    responseTime?: number;
    subquestion?: number;
}

export interface IPlayerGame extends globalTypes.IDBObject {
    gameId?: string;
    isFinished?: boolean;
    joinedAt?: string;
    lessonId?: string;
    playerId?: string;
    position?: number;
    questionScores?: IQuestionScore[];
    score?: number;
    singlePlayerMode?: boolean;
}

// Game
export interface IGamePlayer extends Pick<userTypes.IUser, '_id' | 'email' | 'firstName' | 'lastName' | 'role'> {
    joinedAt?: string;
    playerRole?: TPlayerRole;
}

export interface IGame extends globalTypes.IDBObject {
    endedAt?: string;
    hostRole?: TPlayerRole;
    invitationCode?: string;
    lesson?: string;
    owner?: string;
    players?: IGamePlayer[];
    playerGames?: IPlayerGame[];
    singlePlayerMode?: boolean;
    startedAt?: string;
    status?: STATUS_ENUM;
    winner?: IGamePlayer;
    winnerPoints?: number;
}

//requests
export interface IRemovePlayer {
    playerId: string,
    gameId: string,
}

export type TCreateGame = Pick<IGame, 'hostRole' | 'lesson' | 'singlePlayerMode'>;
export type TJoinGame = Pick<IGame, 'invitationCode'>;

