import { GeckosServer } from "@geckos.io/server";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";

import AppSocketHandler from "./AppSocketHandler";
import TCPClientSocketHandler from "./TCPClientSocketHandler";
import UDPClientSocketHandler from "./UDPClientSocketHandler";

export default class SocketManager {
    constructor (
        public serverSocketTCP: Server,
        public serverSocketUDP: GeckosServer,
        public clientSocketTCP: Socket
    ) {}

    public handle() {
        AppSocketHandler.handle(this.clientSocketTCP, this);
        
        this.serverSocketTCP.on("connection", socket => {
            TCPClientSocketHandler.handle(socket, this);
        });

        this.serverSocketUDP.onConnection(socket => {
            UDPClientSocketHandler.handle(socket, this);
        });
    }
}