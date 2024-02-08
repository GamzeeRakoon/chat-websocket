import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));

let socketsConnected = new Set()

const onConnected = (socket) => {
    console.log(socket.id);
    socketsConnected.add(socket.id)

    socket.emit('clients-total', socketsConnected.size);

    socket.on('disconnect', () => {
        console.log("Socket disconnected", socket.id);
        socketsConnected.delete(socket.id);
        io.emit('clients-total', socketsConnected.size);
    });
}

io.on('connect', onConnected);


