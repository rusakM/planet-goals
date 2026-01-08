import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import http from 'http';
import { Redis } from '../core/constants/env';
import { socketAuthMiddleware } from './middleware/auth';
import { registerPlayerNamespace } from './namespaces/player';

export const initializeSocketServer = (server: http.Server): Server => {
    const io = new Server(server, {
        cors: {
            origin: '*', // configure as needed
            credentials: true,
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    // Redis adapter setup
    const pubClient = createClient({
        url: `redis://${Redis.REDIS_HOST_URL}:${Redis.REDIS_HOST_PORT}`,
    });
    const subClient = pubClient.duplicate();
    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        io.adapter(createAdapter(pubClient, subClient));
    });

    // Socket authentication middleware
    io.use(socketAuthMiddleware);

    // Register namespaces
    registerPlayerNamespace(io);

    return io;
};
