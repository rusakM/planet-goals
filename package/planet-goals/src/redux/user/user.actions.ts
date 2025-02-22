import { UserActionTypes } from "./user.types";
import { IUser, IUserEdit, IUserLogin, IUserRegistration } from "../../types/user";

export const checkEmailFailure = (error) => ({
    type: UserActionTypes.CHECK_EMAIL_FAILURE,
    payload: error,
});

export const checkEmailStart = (email: string) => ({
    type: UserActionTypes.CHECK_EMAIL_START,
    payload: email,
});

export const checkEmailSuccess = (email: string) => ({
    type: UserActionTypes.CHECK_EMAIL_SUCCESS,
    payload: email,
});

export const checkUserSessiom = () => ({
    type: UserActionTypes.CHECK_USER_SESSION,
});

export const setCurrentUser = (user: IUser) => ({
    type: UserActionTypes.SET_CURRENT_USER,
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

export const signUpStart = (userData: IUserRegistration) => ({
    type: UserActionTypes.SIGN_UP_START,
    payload: userData,
});

export const signUpSuccess = (email: string) => ({
    type: UserActionTypes.SIGN_UP_SUCCESS,
    payload: email
});

export const userEditStart = (payload: IUserEdit) => ({
    type: UserActionTypes.USER_EDIT_START,
    payload
});

export const userEditSuccess = (userData: IUser) => ({
    type: UserActionTypes.USER_EDIT_SUCCESS,
    payload: userData
});

export const userEditFailure = (error) => ({
    type: UserActionTypes.USER_EDIT_FAILURE,
    payload: error
});

export const userEerrorClear = () => ({
    type: UserActionTypes.USER_ERROR_CLEAR,
});

export const verifyCodeStart = (payload: IUserLogin) => ({
    type: UserActionTypes.VERIFY_CODE_START,
    payload: payload.verificationCode,
});

export const verifyCodeSuccess = (currentUser: IUser) => ({
    type: UserActionTypes.VERIFY_CODE_SUCCESS,
    payload: currentUser,
});

export const verifyCodeFailure = (error) => ({
    type: UserActionTypes.VERIFY_CODE_FAILURE,
    payload: error,
});
