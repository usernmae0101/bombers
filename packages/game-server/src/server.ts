import geckos from "@geckos.io/server";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "dotenv";
import { io } from "socket.io-client";

import SocketManager from "./sockets/SocketManager";

config();

const isDevMode         = process.env.NODE_ENV === "development";
const appServerPort     = +process.env.APP_SERVER_PORT || 3000;
const appServerAddress  = process.env.APP_SERVER_ADDRESS ||  "127.0.0.1" ;
const gameServerPortUDP = +process.env.GAME_SERVER_UDP_PORT || 3001;
const gameServerPortTCP = +process.env.GAME_SERVER_TCP_PORT || 3002;
const gameServerAddress = process.env.GAME_SERVER_ADDRESS ||  "127.0.0.1" ;
const iceServers = process.env.GAME_SERVER_ICE_LIST ? JSON.parse(process.env.GAME_SERVER_ICE_LIST) : [];

const clientSocketTCP = io(
    `http://${appServerAddress}:${appServerPort}/game-server`, 
    {
        query: {
            gameServer: JSON.stringify({
                TCP_port: gameServerPortTCP,
                address: gameServerAddress,
            })
        }
    }
);

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
