import path from "path";
import { createServer } from "http";
import express from "express";
import mongoose from "mongoose";
import { json, urlencoded } from "body-parser";
import { config } from "dotenv";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";

import apiRouter from "./routes";
import SocketManager from "./sockets/SocketManager";

// parse .env
config();

// express app
const app = express();

// set .env params
const isDevMode = process.env.NODE_ENV === "development";
const port = +process.env.APP_SERVER_PORT || 3000;
const mongoHostname = (isDevMode ? "localhost" : process.env.MONGO_DB_HOSTNAME);

// set static path
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

// routes
app.use("/api", apiRouter);
app.use("*", appRateLimiter, (_, res) => {
    res.sendFile(path.resolve(staticPath, "index.html"));
});

// http-server
const server = createServer(app);

// websocket-server
const io = new Server(server);
SocketManager.handle(io);

// mongoose connection
mongoose.connect(`mongodb://${mongoHostname}:27017/bombers`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        server.listen(port);
        console.log(`handlig as localhost:${port}`);
    })
    .catch(() => { console.error("mongodb error connection") });
