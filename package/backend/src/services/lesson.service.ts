import { dbConnector } from '../core';
import * as errorsAdapter from '../core/errorAdapter';

import * as model from '../models/Lesson';
export import Model = model;

class dbConnectorLesson extends dbConnector<Model.IDBLesson, Model.ILesson, Model.TIndexes> {
    constructor() {
        super(Model.Lesson);
    }
}

export const DB = new dbConnectorLesson();
