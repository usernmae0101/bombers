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
            const { authToken, gameServer, secretKey } = socket.handshake.query;

            // Если передан авторизционный токен, значит соединение инициировал клиент.
            if (authToken) {
                UserModel.findOne({ _id: authToken })
                    .then(user => {
                        // Если токен невалидный (пользователь не найден в БД) - отключаем пользователя.
                        if (!user) socket.disconnect(true);
                        else {
                            // TODO: добавить пользоватея, увеличить онлайн
                            // добавить обработчик "disconnect" на сокет

                            const clientSocketHandler = new ClientSocketHandler(manager, socket);
                            clientSocketHandler.handle();
                        }
                    });
            } else if (gameServer && secretKey === process.env.WEBSOCKET_SECRET_KEY) {
                // В этом случае соединение инициировал игровой сервер.

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