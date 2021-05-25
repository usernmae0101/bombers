import geckos from "@geckos.io/server";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import { io } from "socket.io-client";

import SocketManager from "./sockets/SocketManager";

// parse .env
config();

// set .env vars
const isDevMode = process.env.NODE_ENV === "development";
const appServerPort = isDevMode ? 3000 : +process.env.APP_SERVER_PORT;
const appServerAddress = isDevMode ? "127.0.0.1" : process.env.APP_SERVER_ADDRESS;
const gameServerPortUDP = isDevMode ? 3001 : +process.env.GAME_SERVER_UDP_PORT;
const gameServerPortTCP = isDevMode ? 3002 : +process.env.GAME_SERVER_TCP_PORT;
const gameServerAddress = isDevMode ? "127.0.0.1" : process.env.GAME_SERVER_ADDRESS;
const iceServers = isDevMode ? [] : JSON.parse(process.env.GAME_SERVER_ICE_LIST);

// socket-соединение (TCP) с центральным сервером
const clientSocketTCP = io(`http://${appServerAddress}:${appServerPort}/game-server`, {
    query: {
        gameServer: JSON.stringify({
            TCP_port: gameServerPortTCP,
            address: gameServerAddress,
        })
    }
});

// UDP сервер (также сигнальный для WebRTC)
const serverSocketUDP = geckos({
    // https://ru.wikipedia.org/wiki/Traversal_Using_Relay_NAT
    iceServers,
    ordered: false,
    authorization: async (auth) => ({ token: auth }),
    cors: {
        origin: "*",
        allowAuthorization: true 
    }
});

// TCP сервер (socket.io)
const serverSocketTCP = new Server(createServer(), {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const socketManager = new SocketManager(
    serverSocketTCP,
    serverSocketUDP,
    clientSocketTCP
);
socketManager.handle(gameServerPortUDP, iceServers);

serverSocketUDP.listen(gameServerPortUDP);
console.log(`game server UDP handling as ${gameServerAddress}:${gameServerPortUDP}`);

serverSocketTCP.listen(gameServerPortTCP);
console.log(`game server TCP handling as ${gameServerAddress}:${gameServerPortTCP}`);
