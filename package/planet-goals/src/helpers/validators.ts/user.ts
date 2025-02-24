import Joi from 'joi';
import { UserRoleEnum, IUserEdit } from '../../types/user';
import { LocalesEnum } from '../constants/translations';

export const UserValidators = {
    cookiesAgreement: Joi.boolean(),
    countryCode: Joi.string(),
    email: Joi.string().email({ tlds: { allow: false } }),
    failedLoginAttempts: Joi.number(),
    firstName: Joi.string(),
    isEnabled: Joi.boolean(),
    lastName: Joi.string(),
    lastSeenAt: Joi.string(),
    role: Joi.string().equal(...Object.values(UserRoleEnum)),
    rodoAgreement: Joi.boolean(),
    userInterfaceLanguage: Joi.string().equal(...Object.values(LocalesEnum))
}

export function validateEditUser(editUserData: IUserEdit) {
    const { countryCode, firstName, lastName, role } = editUserData;
    return {
        countryCode: !!(UserValidators.countryCode.required().validate(countryCode).error),
        firstName: !!(UserValidators.firstName.required().validate(firstName).error),
        lastName: !!(UserValidators.lastName.required().validate(lastName).error),
        role: !!(UserValidators.role.required().validate(role).error)
    };
}