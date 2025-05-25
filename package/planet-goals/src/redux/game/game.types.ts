import { gameTypes, lessonTypes } from "../../types";

export const GameActionTypes = {
    RESET_GAME: "RESET_GAME",
    SET_GAME_MODE: "SET_GAME_MODE",
    SET_GAME_STAGE: "SET_GAME_STAGE",
    SET_IS_GAME_CREATED_BY_CURRENT_USER: "SET_IS_GAME_CREATED_BY_CURRENT_USER",
    SET_PLAYER_ROLE: "SET_PLAYER_ROLE",
    SET_SELECTED_LESSON: "SET_SELECTED_LESSON",
    //actions with api in lobby
    CREATE_GAME_START: "CREATE_GAME_START",
    CREATE_GAME_SUCCESS: "CREATE_GAME_SUCCESS",
    CREATE_GAME_FAILURE: "CREATE_GAME_FAILURE",
    JOIN_GAME_START: "JOIN_GAME_START",
    JOIN_GAME_SUCCESS: "JOIN_GAME_SUCCESS",
    JOIN_GAME_FAILURE: "JOIN_GAME_FAILURE",
    REMOVE_PLAYER_START: "REMOVE_PLAYER_START",
    REMOVE_PLAYER_SUCCESS: "REMOVE_PLAYER_SUCCESS",
    REMOVE_PLAYER_FAILURE: "REMOVE_PLAYER_FAILURE",
    START_GAME_START: "START_GAME_START",
    START_GAME_SUCCESS: "START_GAME_SUCCESS",
    START_GAME_FAILURE: "START_GAME_FAILURE",
};

export interface IGameState {
    currentGame: gameTypes.IGame,
    currentLesson: lessonTypes.ILesson,
    gameMode: gameTypes.TGameMode,
    gameStage: gameTypes.TGameStage,
    isGameCreatedByCurrentUser: boolean,
    playerRole: gameTypes.TPlayerRole,
    selectedLesson: number,
}