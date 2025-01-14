import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import routes from './controllers/index';
import { appRoute } from './shared/route';
import { ConstantsEnv } from './core/constants';

import { errorHandler } from './middlewares/error.handler';

const app: express.Express = express();
app.disable('x-powered-by');
app.use(helmet());

Sentry.init({
    dsn: ConstantsEnv.Sentry.SENTRY_DSN,
    environment: ConstantsEnv.Main.APP_MODE ? ConstantsEnv.Main.APP_MODE : 'undefined',
    integrations: [
        nodeProfilingIntegration(),
        Sentry.captureConsoleIntegration({
            levels: ['info', 'warn', 'error'],
        }),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
});
app.use(cors());
app.use(express.json({ limit: '128kb' }));
app.use(express.urlencoded({ extended: true, limit: '128kb' }));

const router: express.Router = express.Router();

router.get(appRoute.getMap().public.status, (request, response) => {
    response.status(200);
    if (ConstantsEnv.Main.APP_MODE) {
        response.json({
            backend: request.hostname,
            deploy: ConstantsEnv.Main.APP_MODE,
            port: ConstantsEnv.Main.PORT,
        });
    } else {
        response.json({
            backend: request.hostname,
            deploy: 'local',
            port: ConstantsEnv.Main.PORT,
        });
    }
});

router.get(appRoute.getMap().public.test, (request, response) => {
    response.status(200);
    response.send('OK');
});

app.use(router);
app.use(routes);

app.use(function (req, res) {
    if (req.method === 'OPTIONS') {
        return void res.status(200).send();
    }
    res.status(404).json({ error: 'Address not found.' });
});

app.use(errorHandler);

async function init(): Promise<http.Server> {
    try {
        const server = http.createServer(app);
        return server;
    } catch (error) {
        console.error(error);
    }
}

export default init;
