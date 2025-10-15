import { GameActionTypes } from "./game.types";
import { gameTypes, lessonTypes } from "../../types";
import { ILesson } from "../../types/lesson";
import { ISendAnswer } from "../../types/game";

export const resetGame = () => {
    sessionStorage.removeItem("invitationCode");
    return {
        type: GameActionTypes.RESET_GAME
    }
};

export const setCurrentQuestion = (payload: lessonTypes.TCurrentQuestion) => ({
    type: GameActionTypes.SET_CURRENT_QUESTION,
    payload
});

export const setGameMode = (mode: gameTypes.TGameMode) => ({
    type: GameActionTypes.SET_GAME_MODE,
    payload: mode
});

export const setGameStage = (stage: gameTypes.TGameStage) => ({
    type: GameActionTypes.SET_GAME_STAGE,
    payload: stage
});

export const setIsGameCreatedByCurrentUser = (state: boolean) => ({
    type: GameActionTypes.SET_IS_GAME_CREATED_BY_CURRENT_USER,
    payload: state
});

export const setPlayerRole = (role: gameTypes.TPlayerRole) => ({
    type: GameActionTypes.SET_PLAYER_ROLE,
    payload: role
});

export const setSelectedLesson = (lesson: number) => ({
    type: GameActionTypes.SET_SELECTED_LESSON,
    payload: lesson
});

export const setWaitingForPlayers = (payload: boolean) => ({
    type: GameActionTypes.SET_WAITING_FOR_PLAYERS,
    payload
});

export const setWaitingTimeUntil = (timeInSek: number) => ({
    type: GameActionTypes.SET_WAITING_TIME_UNTIL,
    payload: timeInSek
});


/// actions with requests

export const createGameStart = (payload: gameTypes.TCreateGame) => ({
    type: GameActionTypes.CREATE_GAME_START,
    payload
});

export const createGameSuccess = (payload: gameTypes.IGame) => ({
    type: GameActionTypes.CREATE_GAME_SUCCESS,
    payload
});

export const createGameFailure = (error) => ({
    type: GameActionTypes.CREATE_GAME_FAILURE,
    payload: error
});

export const endGameSuccess = (payload: gameTypes.IGame) => ({
    type: GameActionTypes.END_GAME_SUCCESS,
    payload
});

export const endGameFailure = (error) => ({
    type: GameActionTypes.END_GAME_FAILURE,
    error
});

export const fetchLessonStart = (lessonId: string) => ({
    type: GameActionTypes.FETCH_LESSON_START,
    payload: lessonId
});

export const fetchLessonSuccess = (payload: ILesson) => ({
    type: GameActionTypes.FETCH_LESSON_SUCCESS,
    payload
});

export const fetchLessonFailure = (error) => ({
    type: GameActionTypes.FETCH_LESSON_FAILURE,
    payload: error
});

export const joinGameStart = (payload: gameTypes.TJoinGame) => ({
    type: GameActionTypes.JOIN_GAME_START,
    payload
});

export const joinGameSuccess = (payload: gameTypes.IGame) => ({
    type: GameActionTypes.JOIN_GAME_SUCCESS,
    payload
});

export const joinGameFailure = (error) => ({
    type: GameActionTypes.JOIN_GAME_FAILURE,
    payload: error
});

export const joinPlayerSuccess = (payload: gameTypes.IGame) => ({
    type: GameActionTypes.JOIN_PLAYER_SUCCESS,
    payload
});

export const joinPlayerFalure = (error) => ({
    type: GameActionTypes.JOIN_PLAYER_FAILURE,
    payload: error
});

export const removePlayerStart = (payload: gameTypes.IRemovePlayer) => ({
    type: GameActionTypes.REMOVE_PLAYER_START,
    payload
});

export const removePlayerSuccess = (payload: gameTypes.IGame) => ({
    type: GameActionTypes.REMOVE_PLAYER_SUCCESS,
    payload
});

export const removePlayerFailure = (error) => ({
    type: GameActionTypes.REMOVE_PLAYER_FAILURE,
    payload: error
});

export const sendAnswerStart = (payload: ISendAnswer) => ({
    type: GameActionTypes.SEND_ANSWER_START,
    payload
});

export const sendAnswerSuccess = (payload: boolean) => ({
    type: GameActionTypes.SEND_ANSWER_SUCCESS,
    payload
});

export const sendAnswerFailure = (error) => ({
    type: GameActionTypes.SEND_ANSWER_FAILURE,
    payload: error
});

export const startGameStart = (gameId: string) => ({
    type: GameActionTypes.START_GAME_START,
    payload: gameId
});

export const startGameSuccess = (payload: gameTypes.IGame) => ({
    type: GameActionTypes.START_GAME_SUCCESS,
    payload
});

export const startGameFailure = (error) => ({
    type: GameActionTypes.START_GAME_FAILURE,
    payload: error
});
