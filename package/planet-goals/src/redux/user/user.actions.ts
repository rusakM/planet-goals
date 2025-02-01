import UserActionTypes from "./user.action.types";

export const checkEmailFailure = (error) => ({
    type: UserActionTypes.CHECK_EMAIL_FAILURE,
    payload: error,
});

export const checkEmailStart = (email: string) => ({
    type: UserActionTypes.CHECK_EMAIL_START,
    payload: email,
});

export const checkEmailSuccess = (user) => ({
    type: UserActionTypes.CHECK_EMAIL_SUCCESS,
    payload: user,
});

export const checkUserSessiom = () => ({
    type: UserActionTypes.CHECK_USER_SESSION,
});

export const setCurrentUser = (user) => ({
    type: UserActionTypes.SET_CURRENT_USER,
    payload: user,
});

export const signInFailure = (error) => ({
    type: UserActionTypes.SIGN_IN_FAILURE,
    payload: error,
});

export const signInStart = (userData) => ({
    type: UserActionTypes.SIGN_IN_START,
    payload: userData,
});

export const signInSuccess = (user) => ({
    type: UserActionTypes.SIGN_IN_SUCCESS,
    payload: user,
});

export const signOutFailure = (error) => ({
    type: UserActionTypes.SIGN_OUT_FAILURE,
    payload: error,
});

export const signOutStart = () => ({
    type: UserActionTypes.SIGN_OUT_START,
});

export const signOutSuccess = () => ({
    type: UserActionTypes.SIGN_OUT_SUCCESS,
});

export const signUpFailure = (error) => ({
    type: UserActionTypes.SIGN_UP_FAILURE,
    payload: error,
});

export const signUpStart = (userData) => ({
    type: UserActionTypes.SIGN_UP_START,
    payload: userData,
});

export const signUpSuccess = (user) => ({
    type: UserActionTypes.SIGN_UP_SUCCESS,
    payload: user,
});

export const userEerrorClear = () => ({
    type: UserActionTypes.USER_ERROR_CLEAR,
});
