import {io} from "socket.io-client";

const WS_AGENT_URL = process.env.WS_AGENT_URL;

let activeWs = {};

export const spawnWsAgent = (opts = {
    autoReconnect: true,
    reconnectAttempts: 5,
    reconnectDelay: 1000,
}) => {
    const uuid = crypto.randomUUID();
    const socket = io(WS_AGENT_URL!, {
        autoConnect: opts.autoReconnect,
        reconnectionAttempts: opts.reconnectAttempts,
        reconnectionDelay: opts.reconnectDelay,
    });

    socket.on('connect', () => {
        console.log(`agent ${uuid} connected to ${WS_AGENT_URL}`);
    });

    activeWs[uuid] = socket;

    socket.on('disconnect', () => {
        console.log(`agent ${uuid} disconnected from ${WS_AGENT_URL}`);
        delete activeWs[uuid];
    })

    socket.on('error', (err) => {
        console.log(`agent ${uuid} error: ${err}`);
        console.error(err);
        delete activeWs[uuid];
    })

    return socket
}

export const cleanupWsAgents = () => {
    Object.keys(activeWs).forEach(uuid => {
        activeWs[uuid].disconnect();
        delete activeWs[uuid];
    });
};

export const listWsAgents = () => {
    return Object.keys(activeWs).map(uuid => {
        return {
            uuid,
            connected: activeWs[uuid].connected,
        }
    });
}