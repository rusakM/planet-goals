import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

import * as errorAdapter from '../../core/errorAdapter';
import { ConstantsGame } from '../../core/constants';

export const validateAnswer = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object().keys({
        answer: Joi.string().required(),
        questionNumber: Joi.number().min(0).required(),
        responseTime: Joi.number().min(0).required(),
        subquestionNumber: Joi.number().min(0).required(),
    });

    const error: Joi.ValidationError = schema.validate(req.body).error;
    if (error) throw errorAdapter.Core.createError(errorAdapter.Core.ErrorsEnum.VALIDATION_ERROR, { entity: 'Answer data', details: error.details });

    return next();
};
