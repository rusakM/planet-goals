import { TFeedbackMode } from "../components/game-button/game-button";
import { ISubquestion } from "../types/lesson";

export function getFeedback<T extends boolean | number = boolean | number>(showAnswers: boolean, answerEqIndex: boolean, index: T, check: (index: T) => boolean): TFeedbackMode {
    if (!showAnswers) return "none";
    if (answerEqIndex) {
        if (check(index)) return "correct";
        return "incorrect"
    }
    return "none";
}

export function calculateTimeUntil(subquestion: ISubquestion, timeUntil?: number): number {
    if (!timeUntil) return (Date.now() + subquestion?.timeInSek * 1000) - 800;
    const calculatedTimeUntil = subquestion.timeInSek ? Date.now() + subquestion.timeInSek * 1000 : timeUntil;
    let selectedTimeUntil = calculatedTimeUntil > timeUntil ? timeUntil : calculatedTimeUntil;
    if (subquestion?.answers?.length) selectedTimeUntil -= 800;
    return selectedTimeUntil;
}
