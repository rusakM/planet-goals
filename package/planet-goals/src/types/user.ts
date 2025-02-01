export type TUserRole = "STUDENT" | "TEACHER";

export interface IUser {
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

export interface IUserRegistration {
    cookiesAgreement?: IUser["cookiesAgreement"];
    countryCode: IUser["countryCode"];
    email: IUser["email"];
    firstName: IUser["firstName"];
    lastName: IUser["lastName"];
    rodoAgreement?: IUser["rodoAgreement"];
    role: IUser["role"];
    userInterfaceLanguage?: IUser["userInterfaceLanguage"];
}

export interface IUserLogin {
    email: IUser["email"];
    verificationCode: string;
}
