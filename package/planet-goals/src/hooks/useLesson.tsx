import { ILesson, TCurrentQuestion } from "../types/lesson";

export const getNextSubquestionIndex = (questions: ILesson['questions'], currentIndex: TCurrentQuestion): TCurrentQuestion => {
    if (!questions?.length) return currentIndex;
    
    const isLastQuestion = questions?.length === (currentIndex[0] + 1);
    const isLastSubquestion = questions?.[currentIndex[0]]?.subquestions?.length === (currentIndex[1] + 1);
    
    if (!isLastSubquestion) return [currentIndex[0], currentIndex[1] + 1];
    else if (isLastSubquestion && !isLastQuestion) return [currentIndex[0] + 1, 0];
    return currentIndex;
} 