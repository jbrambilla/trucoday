import { io } from 'socket.io-client';

let socket;

export const getSocket = (query) => {
    if (!socket) {
        socket = io('http://localhost:5000', {query});
    }
    return socket;
};