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
} from "./user.actions";

//actionsDefinitions
const checkEmailStart = createAction(UserActionTypes.CHECK_EMAIL_START);
const signUpStart = createAction(UserActionTypes.SIGN_UP_START);
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
        yield put(signUpSuccess());
    } catch (error) {
        yield put(signUpFailure(error.name));
    }
}

function* verifyCode({ payload: { code, email } }) {
    try {
        const user: UserApiTypes.IUserConfirm =
            yield Api.sendData<UserApiTypes.IUserConfirm>(
                constantsUrls.User.confirm,
                { email, code },
                "POST"
            );
        localStorage.setItem("token", user.token);
        yield put(verifyCodeSuccess(user.user));
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

function* onVerifyCodeStart(): Generator {
    yield takeLatest(verifyCodeStart, verifyCode);
}

export function* userSagas() {
    yield all([
        call(onCheckEmailStart),
        call(onSignUpStart),
        call(onVerifyCodeStart),
    ]);
}
