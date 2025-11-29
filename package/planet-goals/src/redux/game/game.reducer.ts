import { PersistConfig, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";

import { GameActionTypes, IGameState } from "./game.types";
import { SocketActionTypes } from "../sockets/socket.types";

const INITIAL_STATE: IGameState = {
    currentGame: null,
    currentLesson: null,
    currentQuestion: [0, 0],
    currentQuestionSetAt: 0,
    currentLeaderboard: [],
    gameError: "",
    gameMode: null,
    gameStage: null,
    isGameCreatedByCurrentUser: false,
    isGameStarted: false,
    lessonError: "",
    playerRole: null,
    selectedLesson: 0,
    waitingForPlayers: false,
    waitingTimeUntil: 0,
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
                gameError: "",
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
        case GameActionTypes.JOIN_PLAYER_SUCCESS:
        case GameActionTypes.REMOVE_PLAYER_SUCCESS:
            return {
                ...state,
                currentGame: action.payload,
                gameError: ""
            }
        case GameActionTypes.START_GAME_SUCCESS:
            return {
                ...state,
                currentGame: action.payload,
                gameError: "",
                isGameStarted: true
            };
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
                currentLesson: action.payload,
                gameError: ""
            };
        case GameActionTypes.FETCH_LESSON_FAILURE:
            return {
                ...state,
                lessonError: action.payload
            };
        case GameActionTypes.SET_CURRENT_QUESTION:
            return {
                ...state,
                currentQuestion: action.payload,
                currentQuestionSetAt: Date.now(),
                gameError: "",
                waitingForPlayers: false,
            }
        case SocketActionTypes.GAME_LEADERBOARD:
            return {
                ...state,
                currentLeaderboard: action.payload.leaderboard,
                waitingForPlayers: false,
            }
        case SocketActionTypes.GAME_SUBQUESTION: 
            return {
                ...state,
                currentQuestion: [action.payload.question, action.payload.subquestion],
                currentQuestionSetAt: Date.now(),
                waitingForPlayers: false,
            }
        case GameActionTypes.SET_WAITING_FOR_PLAYERS: {
            return {
                ...state,
                waitingForPlayers: action.payload
            };
        }
        case GameActionTypes.SET_WAITING_TIME_UNTIL:
            return {
                ...state,
                waitingTimeUntil: action.payload
            }
        default:
            return state;
    }
};

const gamePersistConfig: PersistConfig<object> = {
    key: "game",
    storage: sessionStorage,
};

const persistedGameReducer = persistReducer(gamePersistConfig, gameReducer);

export default persistedGameReducer;