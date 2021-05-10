import geckos from "@geckos.io/server";
import { config } from "dotenv";
import { io } from "socket.io-client";

// parse .env
config();

// set .env vars
const isDevMode = process.env.NODE_ENV === "development";
const appServerPort = isDevMode ? 3000 : +process.env.APP_SERVER_PORT;
const appServerAddress = isDevMode ? "127.0.0.1" : process.env.APP_SERVER_ADDRESS;
const gameServerPort = isDevMode ? 3001 : +process.env.GAME_SERVER_PORT;
const gameServerAddress = isDevMode ? "127.0.0.1" : process.env.GAME_SERVER_ADDRESS;
const iceServers = isDevMode ? [] : JSON.parse(process.env.GAME_SERVER_ICE_LIST);

// socket-соединение (TCP) с центарльным сервером
const socket = io(`http://${appServerAddress}:${appServerPort}`, {
    query: {
        secretKey: process.env.WEBSOCKET_SECRET_KEY,
        gameServer: JSON.stringify({ 
            port: gameServerPort,
            address: gameServerAddress,
            iceServers 
        })
    }
});

// сигнальный (HTTP) и RTCPeer (UDP) сервер
const geckoServerUDP = geckos({
    // сюда обязательно TURN-сервер
    // https://ru.wikipedia.org/wiki/Traversal_Using_Relay_NAT
    iceServers,
    ordered: false
});

geckoServerUDP.onConnection(channel => {
    console.log(channel); // debugger
});

geckoServerUDP.listen(gameServerPort);
console.log(`game server handling as http://${gameServerAddress}:${gameServerPort}`);
