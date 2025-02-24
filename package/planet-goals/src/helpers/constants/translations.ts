import { UserRoleEnum } from "../../types/user";
export type TLocale = "el" | "en" | "es" | "it" | "nb" | "pl" | "sl" | "sv";

export enum LocalesEnum {
    el = 'el',
    en = 'en',
    es = 'es',
    it = 'it',
    nb = 'nb',
    pl = 'pl',
    sl = 'sl',
    sv = 'sv',
}

export const ROLES_TRANSLATIONS: {[key in UserRoleEnum]: string} = {
    [UserRoleEnum.STUDENT]: 'main.roles.student',
    [UserRoleEnum.TEACHER]: 'main.roles.teacher'
}