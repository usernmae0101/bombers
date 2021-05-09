import geckos from "@geckos.io/server";
import { config } from "dotenv";

// parse .env
config();

// set .env vars
const isDevMode = process.env.NODE_ENV === "development";
const gameServerPort = isDevMode ? 3001 : +process.env.GAME_SERVER_PORT;
const gameServerAddress = isDevMode ? "127.0.0.1" : process.env.GAME_SERVER_ADDRESS;

// сигнальный (HTTP) и RTCPeer (UDP) сервер
const geckoServerUDP = geckos({
    // сюда обязательно TURN-сервер
    // https://ru.wikipedia.org/wiki/Traversal_Using_Relay_NATS
    iceServers: [],
    ordered: false
});

geckoServerUDP.onConnection(channel => {
    console.log(channel); // debugger
});

geckoServerUDP.listen(gameServerPort);
console.log(`game server handling as http://${gameServerAddress}:${gameServerPort}`);