import { ISubquestion } from "../../types/lesson";

export interface ISubquestionComponent {
    questionData: ISubquestion;
    showAnswers?: boolean;
}