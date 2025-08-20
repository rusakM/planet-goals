import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Main } from '../../core/constants/env';
import type { IDecodedToken } from '../../shared/defs';

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];
        if (!token) {
            return next(new Error('Authentication error: missing token'));
        }
        const decoded = jwt.verify(typeof token === 'string' ? token.replace(/^Bearer /, '') : token, Main.JWT_SECRET) as IDecodedToken;
        console.log(decoded);
        //console.log(socket.handshake);
        socket.data.decoded_token = decoded;
        next();
    } catch (err) {
        next(new Error('Authentication error: invalid token'));
    }
};
