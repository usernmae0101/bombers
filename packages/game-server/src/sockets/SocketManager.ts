import { GeckosServer } from "@geckos.io/server";
import { Server } from "socket.io";
import { Socket } from "socket.io-client";

import * as Shared from "@bombers/shared/src/idnex";
import AppSocketHandler from "./AppSocketHandler";
import BattleTCPClientSocketHandler from "./BattleTCPClientSocketHandler";
import LobbyTCPClientSocketHandler from "./LobbyTCPClientSocketHandler";
import UDPClientSocketHandler from "./UDPClientSocketHandler";
import Room from "../core/Room";

export default class SocketManager {
    constructor(
        public serverSocketTCP: Server,
        public serverSocketUDP: GeckosServer,
        public clientSocketTCP: Socket
    ) { }

    public pong(namespace: "battle" | "lobby") {
        this.serverSocketTCP.of(namespace).emit(
            String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG)
        );
    }

    public handle(UDP_port: number, iceServers: any) {
        const room = new Room(this, Shared.Enums.GameMaps.MAP_1);

        // соединение с центральным сервером
        // игровой сервер - инициатор соединения (клиент)
        AppSocketHandler.handle(this.clientSocketTCP, this);

        // Срабатывает при подключении пользователя по TCP из игрового лобби.
        this.serverSocketTCP.of("lobby").on("connection", socket => {
            // передаём состояние игровой комнаты подключенному сокету
            socket.emit(
                String(Shared.Enums.SocketChannels.GAME_ON_SET_ROOM_STATE),
                room.state
            );

            LobbyTCPClientSocketHandler.handle(socket, this);
        });

        // Срабатывает при подключении пользователя по TCP из игровой комнаты.
        this.serverSocketTCP.of("battle").on("connection", socket => {
            const { token } = socket.handshake.query;

            BattleTCPClientSocketHandler.handle(socket, this);

            // если пользователь переподключился (например, вылетел)
            if (token as string in room.users) {
                // TODO: доделать
                return;
            }

            // если игровая комната закрыта
            if (room.isLocked) {
                socket.disconnect(true);
                return;
            }

            // аутентифицируем пользователя на центральном сервере
            this.clientSocketTCP.emit(
                String(Shared.Enums.SocketChannels.APP_ON_GAME_AUTH),
                {
                    token,
                    // передаём, чтобы вызвать .disconnect() при неудаче
                    socketId: socket.id
                }
            );
        });

        // Срабатывает при подключении пользователя по UDP из игровой комнаты.
        this.serverSocketUDP.onConnection(socket => {
            UDPClientSocketHandler.handle(socket, this);
        });
    }
}
