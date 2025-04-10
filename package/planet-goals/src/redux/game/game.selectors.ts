import { createSelector } from "reselect";
import { IStore } from "../store.types";
import { IGameState } from "./game.types";

const selectGameState = (state: IStore): IGameState => state.game;

export const selectGameMode = createSelector(
    [selectGameState],
    (game) => game.gameMode
);

export const selectGameStage = createSelector(
  [selectGameState],
  (game) => game.gameStage  
);

export const selectPlayerRole = createSelector(
    [selectGameState],
    (game) => game.playerRole
);