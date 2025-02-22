import Joi from 'joi';
import { UserRoleEnum } from '../../types/user';
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
