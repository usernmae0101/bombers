import { GeckosServer } from "@geckos.io/server";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";

import AppSocketHandler from "./AppSocketHandler";
import TCPClientSocketHandler from "./TCPClientSocketHandler";
import UDPClientSocketHandler from "./UDPClientSocketHandler";

const AVAILABLE_TCP_SOCKET_ROOMS = ["LOBBY", "BATTLE"];

export default class SocketManager {
    constructor (
        public serverSocketTCP: Server,
        public serverSocketUDP: GeckosServer,
        public clientSocketTCP: Socket
    ) {}

    public handle() {
        // соединение с центральным сервером (игровй сервер - клиент)
        AppSocketHandler.handle(this.clientSocketTCP, this);
        
        this.serverSocketTCP.on("connection", socket => {
            const { room } = socket.handshake.query;
            
            if (AVAILABLE_TCP_SOCKET_ROOMS.includes(room as string)) {
                socket.join(room);

                TCPClientSocketHandler.handleLobby(socket, this);
                TCPClientSocketHandler.handleBattle(socket, this);
            } else 
                socket.disconnect(true);
        });

        this.serverSocketUDP.onConnection(socket => {
            UDPClientSocketHandler.handle(socket, this);
        });
    }
}