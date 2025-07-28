import { IAction } from "../store.types";
import { SocketActionTypes } from "./socket.types";

interface SocketState {
    connected: boolean;
    error: string | null;
}
const INITIAL_STATE: SocketState = {
    connected: false,
    error: null,
};

const socketReducer = (state = INITIAL_STATE, action: IAction<unknown>) => {
    switch (action.type) {
        case SocketActionTypes.SOCKET_CONNECT:
            return { ...state, connected: true, error: null };
        case SocketActionTypes.SOCKET_DISCONNECT:
            return { ...state, connected: false };
        default:
            return state;
    }
};

export default socketReducer;