import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { 
    SocketActionTypes, 
    IGameSubquestion,
    IPlayerDelete,
    IPlayerJoin,
    IGameStart,
} from './socket.types';
import * as gameActions from '../game/game.actions';
import { IStore } from '../store.types';
import { createAction } from '@reduxjs/toolkit';
import { STATUS_ENUM } from '../../types/game';
import { ERRORS_ENUM as GAME_ERRORS_ENUM} from '../../api/game.api';

const getCurrentGameState = (state: IStore) => state.game;
const getCurrentUserState = (state: IStore) => state.user;
const endGameAction = createAction(SocketActionTypes.GAME_ENDED);
const gameSubquestionAction = createAction(SocketActionTypes.GAME_SUBQUESTION);
const playerDeleteAction = createAction(SocketActionTypes.GAME_PLAYER_DELETE);
const playerJoinAction = createAction(SocketActionTypes.GAME_PLAYER_JOIN);
const startGameAction = createAction(SocketActionTypes.GAME_START);

function* gameSubquestion({payload}: { payload: IGameSubquestion }) {
    try {
        const { question, subquestion, timeUntil } = payload;
        const currentGameState: IStore['game'] = yield select(getCurrentGameState);
        if (timeUntil) yield put(gameActions.setWaitingTimeUntil(timeUntil));
        if (JSON.stringify(currentGameState.currentQuestion) === JSON.stringify([question, subquestion])) return;
        if (currentGameState?.isGameStarted) yield put(gameActions.setCurrentQuestion([question, subquestion]));
    } catch (error) {
        console.error(error);
    }
}

function* startGame({ payload }: { payload: IGameStart }) {
    try {
        const currentGameState: IStore["game"] = yield select(getCurrentGameState);
        if (!currentGameState.currentGame) throw GAME_ERRORS_ENUM.GAME_NOT_FOUND;
        console.log('time until', payload.waitingTimeUntil, new Date().toISOString(), new Date(payload.waitingTimeUntil).toISOString())
        yield put(gameActions.startGameSuccess({
            ...currentGameState.currentGame,
            startedAt: new Date().toISOString(),
            status: STATUS_ENUM.STARTED,
        }));
        yield put(gameActions.setWaitingTimeUntil(payload.waitingTimeUntil));
        yield put(gameActions.setGameStage('wait'));
    } catch (error) {
        yield put(gameActions.startGameFailure(error));
    }
}

function* playerDelete({ payload }: { payload: IPlayerDelete }) {
    try {
        const { playerId } = payload;
        const [currentUserState, currentGameState]: [IStore["user"], IStore["game"]] = yield all([
            select(getCurrentUserState),
            select(getCurrentGameState),
        ])
        if (!currentGameState.currentGame) throw GAME_ERRORS_ENUM.GAME_NOT_FOUND;
        if (currentUserState?.currentUser?._id === playerId) {
            yield put(gameActions.resetGame());
        } else {
            yield put(gameActions.removePlayerSuccess({
                ...currentGameState.currentGame,
                players: currentGameState.currentGame.players.filter((player) => player._id !== playerId)
            }));
        }
    } catch (error) {
        console.error(error);
    }
}

function* playerJoin({ payload }: { payload: IPlayerJoin }) {
    try {
        const { _id, email, firstName, lastName, role } = payload;
        const currentUserState: IStore["user"] = yield select(getCurrentUserState);
        if (currentUserState?.currentUser?._id === _id) {
            return;
        }
        const currentGameState: IStore["game"] = yield select(getCurrentGameState);
        if (!currentGameState.currentGame) throw GAME_ERRORS_ENUM.GAME_NOT_FOUND;
        yield put(gameActions.joinPlayerSuccess({
            ...currentGameState.currentGame,
            players: [
                ...currentGameState.currentGame.players,
                {
                    _id,
                    email,
                    firstName,
                    joinedAt: new Date().toISOString(),
                    lastName,
                    playerRole: role,
                }
            ]
        }));
    } catch (error) {
        console.error(error);
    }
}

function* endGame() {
    try {
        const currentGameState: IStore["game"] = yield select(getCurrentGameState);
        if (!currentGameState.currentGame) throw GAME_ERRORS_ENUM.GAME_NOT_FOUND;
        yield put(gameActions.endGameSuccess({
            ...currentGameState.currentGame,
            endedAt: new Date().toISOString(),
            status: STATUS_ENUM.FINISHED,
        }));
    } catch (error) {
        put(gameActions.endGameFailure(error));
    }
}

function* onEndGameStart() {
    yield takeLatest(endGameAction, endGame);
}

function* onGameSubquestionStart() {
    yield takeLatest(gameSubquestionAction, gameSubquestion);
}

function* onPlayerDeleteStart() {
    yield takeLatest(playerDeleteAction, playerDelete);
}

function* onPlayerJoinStart() {
    yield takeLatest(playerJoinAction, playerJoin);
}

function* onStartGameStart() {
    yield takeLatest(startGameAction, startGame);
}

export function* socketSagas() {
    yield all([
        call(onEndGameStart),
        call(onGameSubquestionStart),
        call(onPlayerDeleteStart),
        call(onPlayerJoinStart),
        call(onStartGameStart)
    ]);
}