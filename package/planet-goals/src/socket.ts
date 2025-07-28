import { io, Socket } from "socket.io-client";

class SocketService {
    private socket: Socket | null = null;

    connect(url: string) {
        const token = localStorage.getItem("token") || "";
        console.log(url);
        if (!this.socket) {
            this.socket = io({
                autoConnect: true,
                auth: {
                    token: `Bearer ${token}`
                },
                path: url,
                transports: ['websocket', 'polling'],
            });
            this.socket.connect();
            console.log('socket connected', this.socket.connected);
        }
    }

    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
        console.log('socket disconnected');
    }

    on(eventName: string, callback: (...args: unknown[]) => void) {
        this.socket?.on(eventName, callback);
    }

    off(eventName: string, callback?: (...args: unknown[]) => void) {
        this.socket?.off(eventName, callback);
    }

    emit(eventName: string, data?: unknown) {
        this.socket?.emit(eventName, data);
    }

    isConnected() {
        return this.socket?.connected || false;
    }
}

const socketService = new SocketService();

export default socketService;
