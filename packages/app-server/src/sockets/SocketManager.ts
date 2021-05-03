import { Server } from "socket.io";

import { IServerAppState } from "@bombers/shared/src/utils/interfaces";
import { state } from "./state";
import { UserModel } from "../models";
import ClientSocketHandler from "./ClientSocketHander";
import GameServerSocketHandler from "./GameSeverSocketHander";

export default class SocketManager {
    constructor(
        public io: Server,
        public state: IServerAppState
    ) { }

    /**
     * Обрабатывает подключения/отключения к веб-сокет серверу.
     */
    public static handle(io: Server) {
        const manager = this.create(io);

        io.on("connection", socket => {
            const { authToken, secretKey } = socket.handshake.query;

            // Если передан авторизционный токен, значит соединение иницировал клиент.
            if (authToken) {
                // Ищем пользователя в БД по переденному токену.
                UserModel.findOne({ _id: authToken })
                    .then(user => {
                        // Если токен невалидный (пользователь не найден в БД) - отключаем пользователя.
                        if (!user) socket.disconnect(true);
                        // В ином случае подключаем пользователя к серверу.
                        else {
                            const clientSocketHandler = new ClientSocketHandler(manager, socket);
                            clientSocketHandler.handle();
                        }
                    });
            } else if (secretKey && secretKey === process.env.WEBSOCKET_SECRET_KEY) {
                // В этом случае соединение иницировал игровой сервер.
                // TODO: добавить сервер в стейт и сообщить пользователям.
                const gameServerSocketHandler = new GameServerSocketHandler(manager, socket);
                gameServerSocketHandler.handle();
            } else socket.disconnect(true);
        });
    }

    public static create(io: Server): SocketManager {
        return new SocketManager(io, state);
    }
}