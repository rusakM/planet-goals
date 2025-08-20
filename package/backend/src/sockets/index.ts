import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import http from 'http';
import { Redis } from '../core/constants/env';
import { socketAuthMiddleware } from './middleware/auth';
import { registerPlayerNamespace } from './namespaces/player';

const debugMiddleware = (socket: any, next: any) => {
    console.log('🔍 DEBUG: New connection attempt');
    console.log('Socket ID:', socket.id);
    console.log('Namespace:', socket.nsp.name);
    console.log('Transport:', socket.conn.transport.name);
    console.log('Headers:', socket.handshake.headers);
    console.log('Auth:', socket.handshake.auth);
    console.log('Query:', socket.handshake.query);
    console.log('User Agent:', socket.handshake.headers['user-agent']);
    console.log('Origin:', socket.handshake.headers.origin);
    console.log('==========================================');
    next();
};

export const initializeSocketServer = (server: http.Server): Server => {
    const io = new Server(server, {
        cors: {
            origin: '*', // configure as needed
            credentials: true,
        },
    });

    // Redis adapter setup
    const pubClient = createClient({
        url: `redis://${Redis.REDIS_HOST_URL}:${Redis.REDIS_HOST_PORT}`,
    });
    const subClient = pubClient.duplicate();
    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        io.adapter(createAdapter(pubClient, subClient));
    });

    io.use(debugMiddleware);

    // Socket authentication middleware
    io.use(socketAuthMiddleware);

    // Register namespaces
    registerPlayerNamespace(io);

    return io;
};
