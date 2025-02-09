import { IUser } from "../types/user";

export interface IUserConfirm {
    token: string;
    user: IUser;
}

export interface ISignUser {
    message: string;
}

export const ERRORS_ENUM = {
    USER_WITH_EMAIL_NOT_FOUND: "USER_WITH_EMAIL_NOT_FOUND",
};
