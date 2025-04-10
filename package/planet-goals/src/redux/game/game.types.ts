import { gameTypes } from "../../types";

export const GameActionTypes = {
    RESET_GAME: "RESET_GAME",
    SET_GAME_MODE: "SET_GAME_MODE",
    SET_GAME_STAGE: "SET_GAME_STAGE",
    SET_PLAYER_ROLE: "SET_PLAYER_ROLE",
};

export interface IGameState {
    gameMode: gameTypes.TGameMode,
    gameStage: gameTypes.TGameStage,
    playerRole: gameTypes.TPlayerRole,
}