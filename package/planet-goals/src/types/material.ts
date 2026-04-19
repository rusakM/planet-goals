import { LocalesEnum } from "../helpers/constants/translations";

export interface IMaterial {
    materialNumber: number;
    names: { [key in LocalesEnum]: string };
    translation: string;
}