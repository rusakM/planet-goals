export type TUserRole = "STUDENT" | "TEACHER";

export enum UserRoleEnum {
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER'
}

export interface IUser {
    _id?: string;
    cookiesAgreement?: boolean;
    countryCode?: string;
    email?: string;
    failedLoginAttempts?: number;
    firstName?: string;
    isEnabled?: boolean;
    lastName?: string;
    lastSeenAt?: string;
    role?: TUserRole;
    rodoAgreement?: boolean;
    userInterfaceLanguage?: string;
}

export interface IUserEdit {
    cookiesAgreement?: IUser["cookiesAgreement"];
    countryCode?: IUser["countryCode"];
    firstName?: IUser["firstName"];
    lastName?: IUser["lastName"];
    rodoAgreement?: IUser["rodoAgreement"];
    role?: IUser["role"];
    userInterfaceLanguage?: IUser["userInterfaceLanguage"];
}

export interface IUserLogin {
    email: IUser["email"];
    verificationCode: string;
}

export interface IUserRegistration {
    email: IUser['email'];
    userInterfaceLanguage?: IUser['userInterfaceLanguage'];
}
