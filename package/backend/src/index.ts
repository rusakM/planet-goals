import 'express-async-errors';
import { ConstantsEnv } from './core/constants';
import initDB from './core/initDB';

const { HOST, PORT } = ConstantsEnv.Main;

initDB().then(async () => {
    const app = await import('./app');
    const server = await app.default();

    server.listen(PORT, '0.0.0.0', () => {
        console.info(`Planet-goals API started on ${HOST}:${PORT}.`);
    });
});
