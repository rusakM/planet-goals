import multer, { Multer, FileFilterCallback } from 'multer';
import { Request } from 'express';

import { IError, Core as ErrorsCore } from '../core/errorAdapter';
import { ResponseError, DataError, InvalidError } from './defs';

import { UPLOAD_MAX_ALLOWED_FILES, UPLOAD_MAX_ALLOWED_FILES_SIZE } from '../core/constants/global';

function prepareResponse(response: any, data: any, responseSender: () => void, err?: ResponseError, non200Status?: number) {
    if (err) {
        response.status(err.status);
        if (err.error) {
            response.json({
                error: err.message,
                original: err.error.name,
                stack: err.error.stack,
            });
        } else {
            response.json({ error: err.message });
        }
    } else {
        if (data) {
            response.status(non200Status ?? 200);
            responseSender();
        } else {
            response.status(204);
            response.send();
        }
    }
}

export namespace appRoute {
    const servicesPrefix = {
        api: '/api',
    };

    export function getMap() {
        return {
            public: {
                test: '/',
                status: '/status',
            },
            user: {
                auth: {
                    confirm: `${servicesPrefix.api}/user/auth/confirm`,
                    edit: `${servicesPrefix.api}/user/auth/edit`,
                    login: `${servicesPrefix.api}/user/auth/login`,
                    me: `${servicesPrefix.api}/user/auth/me`,
                    refresh: `${servicesPrefix.api}/user/auth/refresh-token`,
                    register: `${servicesPrefix.api}/user/auth/register`,
                },
                stats: {
                    get: `${servicesPrefix.api}/user/stats`,
                },
            },

            game: {
                create: `${servicesPrefix.api}/game`,
                join: `${servicesPrefix.api}/game/join`,
                removePlayer: `${servicesPrefix.api}/game/:gameId/remove-player/:playerId`,
                start: `${servicesPrefix.api}/game/:gameId/start`,
                sendAnswer: `${servicesPrefix.api}/game/:gameId/answer`,
            },

            lesson: {
                get: `${servicesPrefix.api}/lesson/:lessonId`,
            },
        };
    }
}

export namespace appSocket {
    export const namespace = {
        PLAYER: '/player',
    };

    export const event = {
        GAME_ENDED: 'game:ended',
        GAME_LEADERBOARD: 'game:leaderboard',
        GAME_PLAYER_GAME: 'game:playerGame',
        GAME_PLAYER_DELETE: 'game:playerDelete',
        GAME_PLAYER_JOIN: 'game:playerJoin',
        GAME_START: 'game:start',
        GAME_SUBQUESTION: 'game:subquestion',
        PLAYER_JOIN_GAME: 'joinGame',
    };
}

export namespace appRequest {
    export function setupUpload(): Multer {
        const storage = multer.memoryStorage();

        const upload = multer({
            storage,
            limits: {
                files: UPLOAD_MAX_ALLOWED_FILES,
                fileSize: UPLOAD_MAX_ALLOWED_FILES_SIZE * 1024 * 1024,
            },
            fileFilter(req: Request, file: Express.Multer.File, callback: FileFilterCallback): void {
                if (!/^image\//.test(file.mimetype) && !/^application\/pdf$/.test(file.mimetype)) {
                    callback(new Error('Incorrect file type'));
                    return;
                } else {
                    callback(null, true);
                }
            },
        });

        return upload;
    }
    export const upload = setupUpload();
}

export namespace appResponse {
    export function getErrorResponse(error: Error): ResponseError {
        const resp = new ResponseError();
        resp.status = 400;
        resp.message = error.message;
        resp.error = error;

        return resp;
    }

    export function getMessageResponse(code: number, message: string): ResponseError {
        const resp = new ResponseError();
        resp.status = code;
        resp.message = message;

        return resp;
    }

    export function prepareJsonResponse(response: any, data: any, err?: ResponseError, non200Status?: number) {
        prepareResponse(
            response,
            data,
            () => {
                response.json(data);
            },
            err,
            non200Status
        );
    }

    export function prepareSuccessNoContentResponse(response: any): void {
        response.status(204).end();
    }

    export function prepareInvalidResponse(response: any, error: InvalidError): void {
        response.status(422).json(error);
    }

    export function prepareStringResponse(response: any, data: string, err?: ResponseError) {
        prepareResponse(
            response,
            data,
            () => {
                response.send(data);
            },
            err
        );
    }

    export function prepareBinaryResponse(response: any, data: Buffer, err?: ResponseError) {
        prepareResponse(
            response,
            data,
            () => {
                response.send(data);
            },
            err
        );
    }

    export function prepareMimeResponse(response: any, data: Buffer, mime: string, err?: ResponseError) {
        prepareResponse(
            response,
            data,
            () => {
                response.contentType(mime);
                response.send(data);
            },
            err
        );
    }

    export function prepareServerError(response: any) {
        response.status(500).send('Unexpected error.');
    }

    export function getReadErrorResponse(error?: { general: Error; data: DataError }, dataErrorMessage?: string, status?: number): ResponseError {
        const resp = new ResponseError();
        if (error && error.general) {
            resp.status = 400;
            resp.message = error.general.message;
            resp.error = error.general;
        } else {
            if (status) {
                resp.status = status;
            } else {
                resp.status = 404;
            }
            if (dataErrorMessage) {
                resp.message = dataErrorMessage;
            } else if (error && error.data) {
                resp.message = `problem with operation: ${error.data.operation}: [${error.data.collection}/${error.data.id}]`;
            } else {
                resp.message = 'data not exists';
            }
        }

        return resp;
    }

    export function prepareErrorResponse(response: any, staticError: IError | null, details?: string) {
        if (!staticError) {
            staticError = ErrorsCore.Errors[ErrorsCore.ErrorsEnum.UNEXPECTED_ERROR];
        }
        return prepareResponse(
            response,
            staticError,
            () => {
                response.json({
                    ...staticError,
                    success: false,
                    details: (!['production'].includes(process.env.APP_MODE) && details) || null,
                });
            },
            null,
            staticError.httpCode
        );
    }
}
