"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWsAgents = exports.cleanupWsAgents = exports.spawnWsAgent = void 0;
const socket_io_client_1 = require("socket.io-client");
const WS_AGENT_URL = process.env.WS_AGENT_URL;
let activeWs = {};
const spawnWsAgent = (opts = {
    autoReconnect: true,
    reconnectAttempts: 5,
    reconnectDelay: 1000,
}) => {
    const uuid = crypto.randomUUID();
    const socket = (0, socket_io_client_1.io)(WS_AGENT_URL, {
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
    });
    socket.on('error', (err) => {
        console.log(`agent ${uuid} error: ${err}`);
        console.error(err);
        delete activeWs[uuid];
    });
    return socket;
};
exports.spawnWsAgent = spawnWsAgent;
const cleanupWsAgents = () => {
    Object.keys(activeWs).forEach(uuid => {
        activeWs[uuid].disconnect();
        delete activeWs[uuid];
    });
};
exports.cleanupWsAgents = cleanupWsAgents;
const listWsAgents = () => {
    return Object.keys(activeWs).map(uuid => {
        return {
            uuid,
            connected: activeWs[uuid].connected,
        };
    });
};
exports.listWsAgents = listWsAgents;
