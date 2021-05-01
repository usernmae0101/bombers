import path from "path";
import { createServer } from "http";
import express from "express";
import mongoose from "mongoose";
import { json, urlencoded } from "body-parser";
import { config } from "dotenv";
import { Server } from "socket.io";

import apiRouter from "./routes";
import SocketManager from "./sockets/SocketManager";

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

app.use("*", (_, res) => {
    res.sendFile(path.resolve(staticPath, "index.html"));
});

const server = createServer(app);

const io = new Server(server);

mongoose.connect(`mongodb://${mongoHostname}:27017/bombers`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        server.listen(port);
        console.log(`handlig as localhost:${port}`);
    })
    .catch(() => { console.error("mongodb error connection") });
