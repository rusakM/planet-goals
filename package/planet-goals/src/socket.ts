import { io, Socket } from "socket.io-client";

class SocketService {
    private socket: Socket | null = null;

    connect(url: string, namespace: string) {
        const token = localStorage.getItem("token") || "";
        console.log(namespace, url);
        if (!this.socket) {
            this.socket = io(`${url}`, {
                autoConnect: true,
                auth: {
                    token: `Bearer ${token}`
                },
                //path: namespace,
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
        console.log('Attempting to emit:', eventName, data);
        console.log('Socket state:', {
            exists: !!this.socket,
            connected: this.socket?.connected,
            id: this.socket?.id
        });
        
        if (!this.socket) {
            console.error('Socket instance does not exist');
            return;
        }
        
        if (!this.socket.connected) {
            console.error('Socket is not connected');
            return;
        }
        
        this.socket.emit(eventName, data, (response: unknown) => {
            console.log('📨 Server acknowledged:', response);
        });
        this.socket.send()
        console.log('Emit completed');
    }

    isConnected() {
        return this.socket?.connected || false;
    }
}

const socketService = new SocketService();

export default socketService;
