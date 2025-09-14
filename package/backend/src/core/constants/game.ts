export namespace Game {
    export enum PLAYER_ROLE {
        player = 'player',
        spectator = 'spectator',
    }

    export enum STATUS_ENUM {
        CREATED = 'CREATED',
        STARTED = 'STARTED',
        CANCELLED = 'CANCELLED',
        FINISHED = 'FINISHED',
    }

    export enum STAGE_ENUM {
        COMPETITION = 'COMPETITION',
        FINAL = 'FINAL', // not for questions
        KNOWLEDGE = 'KNOWLEDGE',
        QUICK_CONTENT = 'QUICK_CONTENT',
    }

    export const GAME_START_WAITING_TIME_MS = 1000 * 10;
}

export namespace Question {
    export enum TYPES_ENUM {
        CONTENT_INSTRUCTION = 'CONTENT_INSTRUCTION',
        CONTENT_QUESTION = 'CONTENT_QUESTION',
        CONTENT_TEXT = 'CONTENT_TEXT',
        CONTENT_TITLE = 'CONTENT_TITLE',
        FILL_IN_CORRECT_ORDER = 'FILL_IN_CORRECT_ORDER',
        FINAL = 'FINAL',
        FIT_TILES = 'FIT_TILES',
        LEADERBOARD = 'LEADERBOARD',
        LEFT_RIGHT = 'LEFT_RIGHT',
        MULTI_CHOOSE = 'MULTI_CHOOSE',
        SELECT_CORRECT_ANSWER = 'SELECT_CORRECT_ANSWER',
        SELECT_CORRECT_ORDER = 'SELECT_CORRECT_ORDER',
        SINGLE_CHOOSE = 'SINGLE_CHOOSE',
        TRUE_FALSE = 'TRUE_FALSE',
    }
}
