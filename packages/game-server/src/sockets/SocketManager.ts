import { GeckosServer } from "@geckos.io/server";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";

import * as Shared from "@bombers/shared/src/idnex";
import AppSocketHandler from "./AppSocketHandler";
import BattleTCPClientSocketHandler from "./BattleTCPClientSocketHandler";
import LobbyTCPClientSocketHandler from "./LobbyTCPClientSocketHandler";
import UDPClientSocketHandler from "./UDPClientSocketHandler";

export default class SocketManager {
    constructor (
        public serverSocketTCP: Server,
        public serverSocketUDP: GeckosServer,
        public clientSocketTCP: Socket
    ) {}

    public pong(namespace: "battle" | "lobby" ) {
        this.serverSocketTCP.of(namespace).emit(
            String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG)
        );
    }

    public handle() {
        // соединение с центральным сервером (игровй сервер - клиент)
        AppSocketHandler.handle(this.clientSocketTCP, this);
        
        this.serverSocketTCP.of("lobby").on("connection", socket => {
            console.log("connected to lobby"); // debugger
            
            // передаём состояние игровой комнаты подключенному сокету
            socket.emit(String(Shared.Enums.SocketChannels.GAME_ON_SET_ROOM_STATE), this._getRoomState());

            LobbyTCPClientSocketHandler.handle(socket, this);
        });

        this.serverSocketTCP.of("battle").on("connection", socket => {
            BattleTCPClientSocketHandler.handle(socket, this);
        });

        this.serverSocketUDP.onConnection(socket => {
            UDPClientSocketHandler.handle(socket, this);
        });
    }

    private _getRoomState(): Shared.Interfaces.IGameRoom {
        return {
            id: "123abc",
            activeSlots: 2,
            totalSlots: 4,
            isLocked: false
        }
    }
}
