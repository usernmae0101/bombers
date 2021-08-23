import { GeckosServer } from "@geckos.io/server";
import io, { Server } from "socket.io";
import { Socket } from "socket.io-client";
import Serializer from "array-buffer-serializer";

import * as Shared from "@bombers/shared/src/idnex";
import AppSocketHandler from "./AppSocketHandler";
import LobbyTCPClientSocketHandler from "./LobbyTCPClientSocketHandler";
import UDPClientSocketHandler from "./UDPClientSocketHandler";
import Room from "../core/Room";

export default class SocketManager {
    public UDP_port: number;
    public iceServers: any;

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
        this.UDP_port = UDP_port;
        this.iceServers = iceServers;

        const room = new Room(this, Shared.Enums.GameMaps.MAP_1);

        // соединение с центральным сервером
        AppSocketHandler.handle(this.clientSocketTCP, this, room);

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
            const { token } = socket.handshake.auth;

            // если пользователь переподключился (например, вылетел)
            if (token as string in room.users) {
                // TODO: доделать
                return;
            }

            // если игровая комната закрыта
            if (room.isLocked) {
                socket.disconnect();
                return;
            }

            // аутентифицируем пользователя на центральном сервере
            this.clientSocketTCP.emit(
                String(Shared.Enums.SocketChannels.APP_ON_GAME_AUTH),
                {
                    token,
                    socketId: socket.id
                }
            );
        });

        // Срабатывает при подключении пользователя по UDP из игровой комнаты.
        this.serverSocketUDP.onConnection(socket => {
            // если подключенный пользователь не в комнате - отключаем
            if (!(socket.userData.token in room.users)) {
                socket.close();
                return;
            }

            UDPClientSocketHandler.handle(socket, room);
        });
    }

    /**
     * Находит сокет по идентификатору из списка подключенных по TCP.
     * 
     * @param socketId - идентификатор сокета
     * @returns сокет
     */
    public getTCPSocketById(socketId: string): io.Socket {
        return this.serverSocketTCP.of("battle").sockets.get(socketId);
    }

    /**
     * Отправляет игровые слоты всем подключенным к комнате сокетам.
     * 
     * @param slots - игровые слоты
     */
    public broadcastGameRoomSlots(slots: Shared.Interfaces.IGameSlots) {
        this.serverSocketTCP.of("battle").to("room").emit(
            String(Shared.Enums.SocketChannels.GAME_ON_UPDATE_GAME_ROOM_SLOTS),
            slots
        );
    }

    /**
     * Отправляет изменения игрового состояния.
     * 
     * @param stateChanges - изменения в игровом состоянии
     */
    public broadcastStateChanges(stateChanges: Shared.Interfaces.IStateChanges) {
        // если есть изменения для UDP
        if (Object.keys(stateChanges.notReliable).length) {
            this.serverSocketUDP.emit(
                String(Shared.Enums.SocketChannels.GAME_ON_UPDATE_GAME_STATE),
                stateChanges.notReliable
            );
        }

        // если есть изменения для TCP
        if (stateChanges.reliable.length) {
            this.serverSocketTCP.of("battle").to("room").emit(
                String(Shared.Enums.SocketChannels.GAME_ON_UPDATE_GAME_STATE),
                stateChanges.reliable
            );
        }
    }
}
