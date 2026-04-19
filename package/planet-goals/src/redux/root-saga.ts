import { all, call } from "redux-saga/effects";
import { gameSagas } from "./game/game.sagas";
import { materialsSagas } from "./materials/materials.sagas";
import { socketSagas } from "./sockets/socket.sagas";
import { userSagas } from "./user/user.sagas";

export default function* rootSaga() {
    yield all([
        call(gameSagas), 
        call(materialsSagas),
        call(socketSagas),   
        call(userSagas),
    ]);
}
