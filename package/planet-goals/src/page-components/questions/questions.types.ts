import { ISubquestion } from "../../types/lesson";

export interface ISubquestionComponent {
    questionData: ISubquestion;
    sendAnswerAction: (answer: string) => void
    showAnswers?: boolean;
}