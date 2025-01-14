import { ConstantsCountries } from '.';

export const UPLOAD_MAX_ALLOWED_FILES = 25;
export const UPLOAD_MAX_ALLOWED_FILES_SIZE = 10;

export namespace Account {
    export enum ROLES_ENUM {
        STUDENT = 'STUDENT',
        TEACHER = 'TEACHER',
    }
}

export namespace App {
    export const FAILED_LOGIN_ATTEMPTS_LIMIT = 5;
    export const ACCOUNT_BLOCK_DURATION_MINUTES = 10;
    export const TEST_MAIL_DOMAIN = '.testplanetgoals.pl';
    export const VERIFICATION_CODES_ARRAY_LENGTH = 5;
    export const VERIFICATION_CODE_EXPIRED_MINUTES = 5;

    export const USER_INTERFACE_LANGUAGES: { [key: string]: string } = {
        [ConstantsCountries._Enum.DE]: ConstantsCountries._Enum.DE,
        [ConstantsCountries._Enum.FR]: ConstantsCountries._Enum.FR,
        [ConstantsCountries._Enum.GB]: ConstantsCountries._Enum.GB,
        [ConstantsCountries._Enum.PL]: ConstantsCountries._Enum.PL,
    };
}
