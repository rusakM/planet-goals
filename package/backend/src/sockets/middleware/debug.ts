import { Socket } from 'socket.io';

export const debugMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    console.log('🔍 DEBUG: New connection attempt');
    console.log('Socket ID:', socket.id);
    console.log('Namespace:', socket.nsp.name);
    console.log('Transport:', socket.conn.transport.name);
    //console.log('Headers:', socket.handshake.headers);
    console.log('Auth:', socket.handshake.auth);
    console.log('Query:', socket.handshake.query);
    console.log('User Agent:', socket.handshake.headers['user-agent']);
    console.log('Origin:', socket.handshake.headers.origin);
    console.log('==========================================');
    next();
};