import { Socket } from "socket.io";

import SocketManager from "./SocketManager";

export default abstract class BaseSocketHandler {
    constructor(
        protected manager: SocketManager,
        protected socket: Socket
    ) {}
    
    abstract handle(): void;
}