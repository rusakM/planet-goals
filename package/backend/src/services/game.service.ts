import { dbConnector } from '../core';
import * as errorsAdapter from '../core/errorAdapter';
import { ConstantsGame } from '../core/constants';

import * as model from '../models/Game';
export import Model = model;
import { lessonService } from '.';

class dbConnectorGame extends dbConnector<Model.IDBGame, Model.IGame, Model.TIndexes> {
    constructor() {
        super(Model.Game);
    }
}

export const DB = new dbConnectorGame();

const contentQuestionChecker = () => true;
const basicQuestionChecker = (answer: string, correctAnswer: string) => answer === correctAnswer;

const checkAnswersFunctions: { [key in ConstantsGame.Question.TYPES_ENUM]: (answer: string, correctAnswer: string) => boolean } = {
    [ConstantsGame.Question.TYPES_ENUM.CONTENT_INSTRUCTION]: contentQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.CONTENT_INTRODUCTION]: contentQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.CONTENT_QUESTION]: contentQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.CONTENT_TEXT]: contentQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.CONTENT_TITLE]: contentQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.FILL_IN_CORRECT_ORDER]: basicQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.FINAL]: contentQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.FIT_TILES]: (answer: string, correctAnswer: string) => {
        if (answer?.length !== correctAnswer?.length) return false;
        const ansArr = JSON.parse(answer) as Array<Array<number>>;
        const corrAnsArr = JSON.parse(correctAnswer) as Array<Array<number>>;
        const normalizeAnswers = (answers: Array<Array<number>>): Array<Array<number>> => {
            return answers.map((pair) => [...pair].sort((a, b) => a - b));
        };

        const normalizedUser = normalizeAnswers(ansArr);
        const normalizedCorrect = normalizeAnswers(corrAnsArr);

        const sortPairs = (pairs: Array<Array<number>>): Array<Array<number>> => {
            return pairs.sort((a, b) => {
                if (a[0] !== b[0]) return a[0] - b[0];
                return a[1] - b[1];
            });
        };

        const sortedCorrect = sortPairs(normalizedCorrect);
        const sortedUser = sortPairs(normalizedUser);

        return JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser);
    },
    [ConstantsGame.Question.TYPES_ENUM.LEADERBOARD]: contentQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.LEFT_RIGHT]: basicQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.MULTI_CHOOSE]: (answer: string, correctAnswer: string) => {
        const ansArr = JSON.parse(answer) as Array<Array<number>>;
        const corrAnsArr = JSON.parse(correctAnswer) as Array<Array<number>>;
        if (corrAnsArr.length !== ansArr.length) return false;
        console.log(ansArr, corrAnsArr);
        if (!ansArr?.length) return false;
        for (let i = 0; i < ansArr.length; i++) {
            if (!corrAnsArr.includes(ansArr[i])) return false;
        }
        return true;
    },
    [ConstantsGame.Question.TYPES_ENUM.SELECT_CORRECT_ANSWER]: basicQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.SELECT_CORRECT_ORDER]: basicQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.SINGLE_CHOOSE]: basicQuestionChecker,
    [ConstantsGame.Question.TYPES_ENUM.TRUE_FALSE]: basicQuestionChecker,
};

export function checkAnswer(subquestion: lessonService.Model.ISubquestion, answer?: string): boolean {
    if (!subquestion?.correctAnswer) return true;
    return checkAnswersFunctions[subquestion.type](answer, subquestion.correctAnswer);
}
