import { TButtonColor } from "../../components/game-button/game-button";

export const FEEDBACK_INCORRECT_TIME = 1500;
export const FEEDBACK_CORRECT_TIME = 2500;
export const FEEDBACK_TIME = FEEDBACK_CORRECT_TIME + FEEDBACK_INCORRECT_TIME;
export const FEEDBACK_FALLBACK = 1000;
export const FEEDBACK_SERVER_FALLBACK = 200;

export const DEFAULT_WAITING_TIME_FOR_START_GAME_SEK = 10;
export const DEFAULT_BTN_COLOR: TButtonColor = "blue";
export const DEFAULT_BTN_COLORS: TButtonColor[] = ["red", "orange", "blue", "green"];

export const LESSONS_IDS = [
    '6aa1a9cadeb4c2d60457390f', // 1
    '507f1f77bcf86cd799439011', // 2
    '68cc2a36f2516e1b47b74a8a', // 3
    '6aa1a9cadeb4c2d60457390f', // 4
    '6aa1a9cadeb4c2d60457390f', // 5
    '6972775be3a2171434593049', // 6
    '6972775be3a2171445693049', // 7
];