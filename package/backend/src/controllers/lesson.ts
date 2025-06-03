import { Request, Response, Router } from 'express';
import { appResponse, appRoute } from '../shared/route';
import { security } from '../shared/security';
import * as ErrorsAdapter from '../core/errorAdapter';
import { lessonService } from '../services';

async function getLessonById(req: Request, res: Response) {
    const { lessonId } = req.params;
    const lesson = await lessonService.DB.Find.byId(lessonId);

    if (!lesson) throw ErrorsAdapter.Game.createError(ErrorsAdapter.Game.ErrorsEnum.LESSON_NOT_FOUND);

    appResponse.prepareJsonResponse(res, lesson);
}

export default function setup(router: Router) {
    router.get(appRoute.getMap().lesson.get, security.validateParams, security.validateAuthenticatedRequest, getLessonById);
}
