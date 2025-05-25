import { dbConnector } from '../core';
import * as errorsAdapter from '../core/errorAdapter';

import * as model from '../models/Game';
export import Model = model;

class dbConnectorGame extends dbConnector<Model.IDBGame, Model.IGame, Model.TIndexes> {
    constructor() {
        super(Model.Game);
    }
}

export const DB = new dbConnectorGame();
