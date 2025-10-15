import { gameTypes, globalTypes } from ".";

export enum QUESTION_TYPES_ENUM {
    CONTENT_INSTRUCTION = 'CONTENT_INSTRUCTION',
    CONTENT_INTRODUCTION = 'CONTENT_INTRODUCTION',
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

export const PLAYABLE_QUESTION_TYPES = [
    QUESTION_TYPES_ENUM.FILL_IN_CORRECT_ORDER,
    QUESTION_TYPES_ENUM.FIT_TILES,
    QUESTION_TYPES_ENUM.LEFT_RIGHT,
    QUESTION_TYPES_ENUM.MULTI_CHOOSE,
    QUESTION_TYPES_ENUM.SELECT_CORRECT_ANSWER,
    QUESTION_TYPES_ENUM.SELECT_CORRECT_ORDER,
    QUESTION_TYPES_ENUM.SINGLE_CHOOSE,
    QUESTION_TYPES_ENUM.TRUE_FALSE
];

export interface ISubquestion {
    answers?: string[];
    correctAnswer?: string;
    correctAnswerIndex?: number;
    description?: string;
    question?: string;
    timeInSek?: number;
    type?: QUESTION_TYPES_ENUM;
}

export interface IQuestion {
    amountQuestions?: number;
    gameStage?: gameTypes.GAME_PLAY_STAGE_ENUM;
    maxPoints?: number;
    multiQuestion?: boolean;
    subquestions?: ISubquestion[];
    totalDurationInMin?: number;
    type?: QUESTION_TYPES_ENUM;
}

export interface ILesson extends globalTypes.IDBObject {
    lessonNumber?: number;
    name?: string;
    nameTranslation?: string;
    questions?: IQuestion[];
}

export type TCurrentQuestion = [question: number, subquestion: number];