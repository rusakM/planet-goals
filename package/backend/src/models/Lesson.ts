import { Schema, Document, model } from 'mongoose';

import { Helper } from '../shared/defs';
import { SchemasGlobal } from '.';
import { ConstantsGame } from '../core/constants';

export interface ISubquestion {
    answers?: string[];
    correctAnswer?: string;
    correctAnswerIndex?: number;
    description?: string;
    question?: string;
    timeInSek?: number;
    type?: ConstantsGame.Question.TYPES_ENUM;
}

export interface IQuestion {
    amountQuestions?: number;
    gameStage?: ConstantsGame.Game.STAGE_ENUM;
    maxPoints?: number;
    multiQuestion?: boolean;
    subquestions?: ISubquestion[];
    totalDurationInMin?: number;
    type?: ConstantsGame.Question.TYPES_ENUM;
}

interface ILessonBasic {
    lessonNumber?: number;
    name?: string;
    nameTranslation?: string;
    questions?: IQuestion[];
}

export interface ILesson extends ILessonBasic, SchemasGlobal.Schemas.IDocument {}
export interface IDBLesson extends ILessonBasic, Document {}

const LessonSchema = new Schema<IDBLesson>(
    {
        lessonNumber: {
            type: Number,
            unique: true,
        },
        name: String,
        nameTranslation: String,
        questions: [
            {
                amountQuestions: {
                    type: Number,
                    default: 1,
                    min: 1,
                },
                gameStage: {
                    type: String,
                    enum: Object.values(ConstantsGame.Game.STAGE_ENUM),
                },
                maxPoints: {
                    type: Number,
                    min: 0,
                },
                multiQuestion: {
                    type: Boolean,
                    default: false,
                },
                subquestions: [
                    {
                        answers: [
                            {
                                type: String,
                            },
                        ],
                        correctAnswer: String,
                        correctAnswerIndex: {
                            type: Number,
                            min: 0,
                        },
                        description: String,
                        timeInSek: Number,
                        type: {
                            type: String,
                            enum: Object.keys(ConstantsGame.Question.TYPES_ENUM),
                        },
                    },
                ],
                totalDurationInMin: Number,
                type: {
                    type: String,
                    enum: Object.keys(ConstantsGame.Game.STAGE_ENUM),
                },
            },
        ],
    },
    SchemasGlobal.Options.dbSchema
);

LessonSchema.index({ lessonNumber: 1 });

export type TIndexes = 'lessonNumber';

export const Lesson = model<IDBLesson>(Helper.prepareTableName('lesson'), LessonSchema);
