import path from "path";
import { createServer } from "http";
import express from "express";
import mongoose from "mongoose";
import { json, urlencoded } from "body-parser";
import { config } from "dotenv";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";

import apiRouter from "./api/routers";
import SocketManager from "./sockets/SocketManager";
import { state } from "./app-state";

config();

const app = express();

const isDevMode = process.env.NODE_ENV === "development";
const port = +process.env.APP_SERVER_PORT || 3000;
const mongoHostname = (isDevMode ? "localhost" : process.env.MONGO_DB_HOSTNAME);

const staticPath = isDevMode ? "../client/dist" : "public";

// middlewares
const appRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20
});
app.use(express.static(path.resolve(staticPath)));
app.use(json());
app.use(urlencoded({
    extended: true
}));

// routers
app.use("/api", appRateLimiter, apiRouter);
app.use("*", appRateLimiter, (_, res) => {
    res.sendFile(
    	path.resolve(staticPath, "index.html")
    );
});

const server = createServer(app);

const io = new Server(server);
const socketManager = new SocketManager(io, state);
socketManager.handle();

mongoose.set("autoIndex", isDevMode);
mongoose.connect(`mongodb://${mongoHostname}:27017/bombers`)
    .then(() => {
        server.listen(port);
        console.log(`handlig as localhost:${port}`);
    })
    .catch((error) => { 
        console.error("mongodb error connection", error) 
    });
