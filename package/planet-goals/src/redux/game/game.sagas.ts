import { takeLatest, put, all, call } from "redux-saga/effects";
import { createAction } from "@reduxjs/toolkit";

import { GameActionTypes } from "./game.types";
import { constantsUrls } from "../../helpers/constants";
import * as Api from "../../api/index";

import {
    createGameFailure,
    createGameSuccess,
    joinGameFailure,
    joinGameSuccess,
    removePlayerFailure,
    removePlayerSuccess,
    startGameFailure,
    startGameSuccess,
} from "./game.actions";
import { IGame, IRemovePlayer } from "../../types/game";

const createGameStart = createAction(GameActionTypes.CREATE_GAME_START);
const joinGameStart = createAction(GameActionTypes.JOIN_GAME_START);
const removePlayerStart = createAction(GameActionTypes.REMOVE_PLAYER_START);
const startGameStart = createAction(GameActionTypes.START_GAME_START);

function* createGame({ payload }) {
    try {
        const game: IGame = yield call(Api.sendData,
            constantsUrls.Game.management.create,
            payload,
            "POST"
        );

        yield put(createGameSuccess(game));
    } catch (error) {
        yield put(createGameFailure(error.name));
    }
}

function* joinGame({ payload }) {
    try {
        const game: IGame = yield call(Api.sendData,
            constantsUrls.Game.management.join,
            payload,
            "POST"
        );

        yield put(joinGameSuccess(game));
    } catch (error) {
        yield put(joinGameFailure(error.name));
    }
}

function* removePlayer({ payload }: { payload: IRemovePlayer }) {
    try {
        const game: IGame = yield call(Api.sendData,
            constantsUrls.Game.management.removePlayer(payload),
            {},
            "DELETE"
        );

        yield put(removePlayerSuccess(game));
    } catch (error) {
        yield put(removePlayerFailure(error.name));
    }
}

function* startGame({ payload }: { payload: string }) {
    try {
        const game: IGame = yield call(Api.sendData,
            constantsUrls.Game.management.start(payload),
            {},
            "PATCH"
        );

        yield put(startGameSuccess(game));
    } catch (error) {
        yield put(startGameFailure(error.name));
    }
}

function* onCreateGameStart(): Generator {
    yield takeLatest(createGameStart, createGame);
}

function* onJoinGameStart(): Generator {
    yield takeLatest(joinGameStart, joinGame);
}

function* onRemovePlayerStart(): Generator {
    yield takeLatest(removePlayerStart, removePlayer);
}

function* onStartGameStart(): Generator {
    yield takeLatest(startGameStart, startGame);
}

export function* gameSagas() {
    yield all([
        call(onCreateGameStart),
        call(onJoinGameStart),
        call(onRemovePlayerStart),
        call(onStartGameStart)
    ]);
}