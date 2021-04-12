import path from "path";
import { createServer } from "http";
import { Server, LobbyRoom, matchMaker } from "colyseus";
import express from "express";
import mongoose from "mongoose";
import { json, urlencoded } from "body-parser";
import { config } from "dotenv";
import { monitor } from "@colyseus/monitor";

import apiRouter from "./routes";
import ChatRoom from "../colyseus/rooms/ChatRoom";
import AppRoom from "../colyseus/rooms/AppRoom";
import BattleRoom from "../colyseus/rooms/BattleRoom";

config();

const app = express();
const isDevMode = process.env.NODE_ENV === "development";
const port = +process.env.HTTP_SERVER_PORT || 3000;
const mongoHostname = (isDevMode ? "localhost" : process.env.MONGO_DB_HOSTNAME);
const staticPath = isDevMode ? "../client/dist" : "public";

app.use(express.static(path.resolve(staticPath)));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/api", apiRouter);
isDevMode && app.use("/colyseus", monitor());

app.use("*", (_, res) => {
    res.sendFile(path.resolve(staticPath, "index.html"));
});

const server = new Server({
    server: createServer(app)
});

server.define("lobby", LobbyRoom);
server.define("app", AppRoom);
server.define("chat", ChatRoom);
server.define("battle", BattleRoom)
    .enableRealtimeListing();

isDevMode && server.simulateLatency(5);

mongoose.connect(`mongodb://${mongoHostname}:27017/bombers`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        server.listen(port);
        console.log(`handlig as localhost:${port}`);

        matchMaker.create("battle", { id: 1 });
        matchMaker.create("battle", { id: 2 });
    })
    .catch(() => { console.error("mongodb error connection") });
