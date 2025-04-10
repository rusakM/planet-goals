import { GameActionTypes, IGameState } from "./game.types";

const INITIAL_STATE: IGameState = {
    gameMode: null,
    gameStage: null,
    playerRole: null
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
        case GameActionTypes.SET_PLAYER_ROLE:
            return {
                ...state,
                playerRole: action.payload
            };
        default:
            return state
    }
};

export default gameReducer;