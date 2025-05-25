import { IRouter, Router } from 'express';

import setupGame from './game';
import setupUserAuth from './userAuth.controller';

const router: IRouter = Router();
setupGame(router);
setupUserAuth(router);

export default router;
