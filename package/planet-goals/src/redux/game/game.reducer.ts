import { GameActionTypes, IGameState } from "./game.types";

const INITIAL_STATE: IGameState = {
    currentGame: null,
    currentLesson: null,
    currentQuestion: [0, 0],
    gameError: "",
    gameMode: null,
    gameStage: null,
    isGameCreatedByCurrentUser: false,
    lessonError: "",
    playerRole: null,
    selectedLesson: 0
};

const gameReducer = (state: IGameState = INITIAL_STATE, action): IGameState => {
    switch (action.type) {
        case GameActionTypes.RESET_GAME:
            return INITIAL_STATE;
        case GameActionTypes.SET_GAME_MODE:
            return {
                ...state,
                gameMode: action.payload
            };
        case GameActionTypes.SET_GAME_STAGE:
            return {
                ...state,
                gameStage: action.payload
            };
        case GameActionTypes.SET_IS_GAME_CREATED_BY_CURRENT_USER:
            return {
                ...state,
                isGameCreatedByCurrentUser: action.payload
            };
        case GameActionTypes.SET_PLAYER_ROLE:
            return {
                ...state,
                playerRole: action.payload
            };
        case GameActionTypes.SET_SELECTED_LESSON:
            return {
                ...state,
                selectedLesson: action.payload
            };
        case GameActionTypes.CREATE_GAME_SUCCESS:
        case GameActionTypes.JOIN_GAME_SUCCESS:
        case GameActionTypes.REMOVE_PLAYER_SUCCESS:
        case GameActionTypes.START_GAME_SUCCESS:
            return {
                ...state,
                currentGame: action.payload
            }
        case GameActionTypes.CREATE_GAME_FAILURE:
        case GameActionTypes.JOIN_GAME_FAILURE:
        case GameActionTypes.START_GAME_FAILURE:
            return {
                ...state,
                gameError: action.payload
            };
        case GameActionTypes.FETCH_LESSON_SUCCESS:
            return {
                ...state,
                currentLesson: action.payload
            };
        case GameActionTypes.FETCH_LESSON_FAILURE:
            return {
                ...state,
                lessonError: action.payload
            };
        case GameActionTypes.SET_CURRENT_QUESTION:
            return {
                ...state,
                currentQuestion: action.payload
            }
        default:
            return state;
    }
};

export default gameReducer;