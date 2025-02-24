import { takeLatest, put, all, call } from "redux-saga/effects";
import { createAction } from "@reduxjs/toolkit";
import { UserActionTypes } from "./user.types";
import { constantsUrls } from "../../helpers/constants";
import * as Api from "../../api/index";
import * as UserApiTypes from "../../api/user.api";

//actions
import {
    checkEmailFailure,
    checkEmailSuccess,
    signUpSuccess,
    signUpFailure,
    verifyCodeSuccess,
    verifyCodeFailure,
    userEditFailure,
    userEditSuccess,
} from "./user.actions";
import { IUser } from "../../types/user";

//actionsDefinitions
const checkEmailStart = createAction(UserActionTypes.CHECK_EMAIL_START);
const signUpStart = createAction(UserActionTypes.SIGN_UP_START);
const userEditStart = createAction(UserActionTypes.USER_EDIT_START);
const verifyCodeStart = createAction(UserActionTypes.VERIFY_CODE_START);

function* checkEmail({ payload }) {
    try {
        yield Api.sendData(
            constantsUrls.User.checkEmail,
            { email: payload },
            "POST"
        );
        yield put(checkEmailSuccess(payload));
    } catch (error) {
        yield put(checkEmailFailure(error.name));
    }
}

function* signUp({ payload }) {
    try {
        yield Api.sendData(constantsUrls.User.signUp, payload, "POST");
        yield put(signUpSuccess(payload.email));
    } catch (error) {
        yield put(signUpFailure(error.name));
    }
}

function* userEdit({ payload }) {
    try {
        const user = yield Api.sendData<IUser>(constantsUrls.User.edit, payload, 'PATCH');
        yield put(userEditSuccess(user));
    } catch (error) {
        yield put(userEditFailure(error.name));
    }
}

function* verifyCode({ payload }) {
    try {
        const {user, token}: UserApiTypes.IUserConfirm = yield call(Api.sendData, constantsUrls.User.confirm, payload, 'POST');
        localStorage.setItem("token", token);
        yield put(verifyCodeSuccess(user));
    } catch (error) {
        console.log(error);
        yield put(verifyCodeFailure(error.name));
    }
}

function* onCheckEmailStart(): Generator {
    yield takeLatest(checkEmailStart, checkEmail);
}

function* onSignUpStart(): Generator {
    yield takeLatest(signUpStart, signUp);
}

function* onUserEditStart(): Generator {
    yield takeLatest(userEditStart, userEdit);
}

function* onVerifyCodeStart(): Generator {
    yield takeLatest(verifyCodeStart, verifyCode);
}

export function* userSagas() {
    yield all([
        call(onCheckEmailStart),
        call(onSignUpStart),
        call(onUserEditStart),
        call(onVerifyCodeStart),
    ]);
}
