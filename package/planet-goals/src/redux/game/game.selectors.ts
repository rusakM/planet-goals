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

export const selectIsGameCreatedByCurrentUser = createSelector(
  [selectGameState],
  (game) => game.isGameCreatedByCurrentUser
);

export const selectPlayerRole = createSelector(
    [selectGameState],
    (game) => game.playerRole
);

export const selectSelectedLesson = createSelector(
  [selectGameState],
  (game) => game.selectedLesson
);

export const selectCurrentGame = createSelector(
  [selectGameState],
  (game) => game.currentGame
);

export const selectCurrentLesson = createSelector(
  [selectGameState],
  (game) => game.currentLesson
);

export const selectCurrentQuestion = createSelector(
  [selectGameState],
  (game) => game.currentQuestion
);
