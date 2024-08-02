import {Server} from "node:http";
import express from 'express';
import { Server as IOserver } from "socket.io";
import cors from 'cors';


const port = process.env.PORT;

const app = express();

export const startServer = async () => {
    const server = await new Promise<Server>((resolve) => {
        const httpServer = app.listen(port, () => {
            console.log(`[server]: Server is running at http://localhost:${port}`);
            resolve(httpServer);
        });
    });

    app.use(cors({
        origin: 'http://localhost:9000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }));

    app.use(express.json({ limit: '1mb' }));

    process.stdin.addListener('data', async function (input) {
        console.log(input.toString());
    });

    const io = new IOserver(server,{
        cors: {
            origin: "http://localhost:9000", // Your client URL
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ['websocket', 'polling'], // Ensure both transports are available
    });

    io.on('connect', (socket) => {
        console.log('connected');
    });

    io.of('/agent/ws').on('connection', (socket) => {
        console.log('a user connected to /agent/ws');

        socket.on('disconnect', () => {
            console.log('user disconnected from /agent/ws');
        });

        // Example event listener
        socket.on('message', (msg) => {
            console.log('/agent/ws msg: ' + msg);
            socket.emit('response', 'Message received!');
        });
    });

    // io.of('/agent/ws').emit('move', { x: 10, y: 0 }); // Move right

};

