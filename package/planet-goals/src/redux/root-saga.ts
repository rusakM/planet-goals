import { all, call } from "redux-saga/effects";
import { gameSagas } from "./game/game.sagas";
import { socketSagas } from "./sockets/socket.sagas";
import { userSagas } from "./user/user.sagas";

export default function* rootSaga() {
    yield all([
        call(gameSagas), 
        call(socketSagas),   
        call(userSagas),
    ]);
}
