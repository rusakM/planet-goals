import { Schema, Document, model } from 'mongoose';

import { Helper } from '../shared/defs';
import { SchemasGlobal } from '.';
import { ConstantsGlobal } from '../core/constants';


interface IMaterialBasic {
    materialNumber: number;
    names: { [key in ConstantsGlobal.App.USER_INTERFACE_LANGUAGES]: string };
    translation: string;
}

export interface IMaterial extends IMaterialBasic, SchemasGlobal.Schemas.IDocument {}
export interface IDBMaterial extends IMaterialBasic, Document {}

const MaterialSchema = new Schema<IDBMaterial>(
    {
        materialNumber: {
            type: Number,
            required: true,
        },
        names: {
            type: Object.fromEntries(
                Object.values(ConstantsGlobal.App.USER_INTERFACE_LANGUAGES).map((lang) => [
                    lang,
                    {
                        type: String,
                        default: '',
                    },
                ])
            ),
            required: true,
        },
        translation: {
            type: String,
            required: true,
        },
    },
    SchemasGlobal.Options.dbSchema
);

MaterialSchema.index({ materialNumber: 1 });

export type TIndexes = 'materialNumber';

export const Material = model<IDBMaterial>(Helper.prepareTableName('material'), MaterialSchema);
