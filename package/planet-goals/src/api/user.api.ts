import { IUser } from "../types/user";

export interface IUserConfirm {
    token: string;
    user: IUser;
}

export interface ISignUser {
    message: string;
}

export const ERRORS_ENUM = {
    ACCOUNT_TEMPORARILY_BLOCKED: "ACCOUNT_TEMPORARILY_BLOCKED",
    INCORRECT_TOKEN_PAYLOAD: "INCORRECT_TOKEN_PAYLOAD",
    INCORRECT_VERIFICATION_CODE: "INCORRECT_VERIFICATION_CODE",
    USER_EMAIL_EXIST: "USER_EMAIL_EXIST",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    USER_WITH_EMAIL_NOT_FOUND: "USER_WITH_EMAIL_NOT_FOUND",
    VERIFICATION_CODE_EXPIRED: "VERIFICATION_CODE_EXPIRED"
};

export const ERRORS_TRANSLATIONS_MAP = Object.fromEntries(
    Object.entries(ERRORS_ENUM).map(
        ([key, val]) => ([key, `errors.${val.toLowerCase()}`])
    )
);