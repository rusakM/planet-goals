import { dbConnector } from '../core';
import * as errorsAdapter from '../core/errorAdapter';

import * as model from '../models/Lesson';
export import Model = model;

interface ILessonStats {
    _id: string;
    maxPoints: number;
}
class dbConnectorLesson extends dbConnector<Model.IDBLesson, Model.ILesson, Model.TIndexes> {
    private stats: ILessonStats[];
    constructor() {
        super(Model.Lesson);
    }

    async getLessonsStats(refresh: boolean = false): Promise<ILessonStats[]> {
        if (this.stats && !refresh) return this.stats;

        const lessons = await this.Get.all();
        if (!lessons?.length) return null;
        const stats: ILessonStats[] = [];

        for (const lesson of lessons) {
            let score = 0;
            for (const question of lesson.questions) score += question.maxPoints;
            stats.push({ _id: lesson._id, maxPoints: score });
        }
        this.stats = stats;
        return stats;
    }
}

export const DB = new dbConnectorLesson();
