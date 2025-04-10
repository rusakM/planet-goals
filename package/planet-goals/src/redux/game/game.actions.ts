import { GameActionTypes } from "./game.types";
import { gameTypes } from "../../types";

export const resetGame = () => ({
    type: GameActionTypes.RESET_GAME
});

export const setGameMode = (mode: gameTypes.TGameMode) => ({
    type: GameActionTypes.SET_GAME_MODE,
    payload: mode
});

export const setGameStage = (stage: gameTypes.TGameStage) => ({
    type: GameActionTypes.SET_GAME_STAGE,
    payload: stage
});

export const setPlayerRole = (role: gameTypes.TPlayerRole) => ({
    type: GameActionTypes.SET_PLAYER_ROLE,
    payload: role
});
