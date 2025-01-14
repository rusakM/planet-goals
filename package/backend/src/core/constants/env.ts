import dotenv from 'dotenv';

dotenv.config();

export enum APP_MODES {
    DEV = 'DEV',
    PRODUCTION = 'PRODUCTION',
    TEST = 'TEST',
}

export namespace Main {
    export const PORT: number = Number(process.env.PORT) || 8081;
    export const HOST: string = process.env.HOST;
    export const APP_MODE: string = process.env.APP_MODE;
    export const JWT_SECRET: string = process.env.JWT_SECRET;
}

export namespace Mongodb {
    export const DB_HOST: string = process.env.DB_HOST;
    export const DB_NAME: string = process.env.DB_NAME;
    export const DB_PASSWORD: string = process.env.DB_PASSWORD;
    export const DB_TABLE_PREFIX: string = process.env.DB_TABLE_PREFIX || '';
    export const DB_USERNAME: string = process.env.DB_USERNAME;
    export const DB_URL: string =
        'mongodb+srv://<username>:<password>@<host>/<database>?retryWrites=true&w=majority';
}

export namespace Sentry {
    export const SENTRY_DSN: string = process.env.SENTRY_DSN;
}
