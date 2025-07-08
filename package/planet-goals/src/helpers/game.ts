import { TFeedbackMode } from "../components/game-button/game-button";

export function getFeedback<T extends boolean | number = boolean | number>(showAnswers: boolean, answerEqIndex: boolean, index: T, check: (index: T) => boolean): TFeedbackMode {
    if (!showAnswers) return "none";
    if (answerEqIndex) {
        if (check(index)) return "correct";
        return "incorrect"
    }
    return "none";
}