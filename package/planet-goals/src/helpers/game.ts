import { TFeedbackMode } from "../components/game-button/game-button";
import { IQuestion, ISubquestion, PLAYABLE_QUESTION_TYPES } from "../types/lesson";
import { constantsGame } from "./constants";

export function getFeedback<T extends boolean | number = boolean | number>(showCorrectAnswers: boolean, showIncorrectAnswers: boolean, index: T, check: (index: T) => boolean): TFeedbackMode {
    if (!showCorrectAnswers && !showIncorrectAnswers) return "none";
    if (showCorrectAnswers && check(index)) return "correct";
    if (showIncorrectAnswers && !check(index)) return "incorrect";
    return "none";
}

export function calculateTimeUntil(subquestion: ISubquestion, timeUntil?: number): number {
    if (!timeUntil) return (Date.now() + subquestion?.timeInSek * 1000) - (constantsGame.FEEDBACK_TIME - constantsGame.FEEDBACK_SERVER_FALLBACK);
    //const calculatedTimeUntil = subquestion.timeInSek ? (Date.now() + subquestion.timeInSek * 1000) + constantsGame.FEEDBACK_TIME : timeUntil;
    let selectedTimeUntil = timeUntil;

    if (subquestion?.answers?.length) selectedTimeUntil -= constantsGame.FEEDBACK_SERVER_FALLBACK;
    return selectedTimeUntil;
}

export function calculateFeedbackTime(question: IQuestion): number {
    if (!PLAYABLE_QUESTION_TYPES.includes(question.type)) return 0;
    return constantsGame.FEEDBACK_TIME;
}
