import { dbConnector } from '../core';

import * as model from '../models/Material';
export import Model = model;


class dbConnectorMaterial extends dbConnector<Model.IDBMaterial, Model.IMaterial, Model.TIndexes> {
    constructor() {
        super(Model.Material);
    }
}

export const DB = new dbConnectorMaterial();