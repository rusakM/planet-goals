import { Request, Response, Router } from 'express';
import { lessonService, playerGameService } from '../services';
import { appResponse, appRoute } from '../shared/route';
import { security } from '../shared/security';
import * as errorsAdapter from '../core/errorAdapter';

async function getUserProgress(req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) throw errorsAdapter.Global.createError(errorsAdapter.Global.ErrorsEnum.USER_NOT_FOUND);

    const playerStats = await playerGameService.Model.PlayerGame.aggregate([
        {
            $match: {
                playerId: userId,
                singlePlayerMode: true,
                score: { $gt: 0 },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $group: {
                _id: '$lessonId',
                lastGame: { $first: '$$ROOT' },
            },
        },
    ]);
    const lessonsStats = await lessonService.DB.getLessonsStats();

    return appResponse.prepareJsonResponse(res, { playerStats, lessonsStats });
}

export default function setup(router: Router) {
    router.get(appRoute.getMap().user.stats.get, security.validateAuthenticatedRequest, getUserProgress);
}
