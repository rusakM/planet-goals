import { IRouter, Router } from 'express';

import setupGame from './game';
import setupLesson from './lesson';
import setupUserAuth from './userAuth.controller';

const router: IRouter = Router();
setupGame(router);
setupLesson(router);
setupUserAuth(router);

export default router;
