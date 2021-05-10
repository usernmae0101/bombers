import { Server } from "socket.io";

import * as Shared from "@bombers/shared/src/idnex";
import { state } from "./state";
import { UserModel, IDocumentUser } from "../models";
import ClientSocketHandler from "./ClientSocketHander";
import GameServerSocketHandler from "./GameSeverSocketHander";

export default class SocketManager {
    constructor(
        public io: Server,
        public state: Shared.Interfaces.IServerAppState
    ) { }

    /**
     * Добавляет игровой сервер в общее состояние на центральном сервре. 
     * 
     * @param server - игровой сервер
     */
    public addGameServerToState(server: Shared.Interfaces.ILobbyServer) {
        this.state.lobby.push(server);
        // TODO: проинформировать пользователей
    }

    public addUserToState(user: Shared.Interfaces.IUser) {
        // TODO: добавить пользователя в список участников чата
        // увеличить онлайн, проинформировать пользователей
        // добавиь текущего пользователя в менеджер
    }

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
                            const userData = this.parseUserData(user);

                            manager.addUserToState(userData);
                            // TODO: добавить обработчик "disconnect" на сокет 

                            const clientSocketHandler = new ClientSocketHandler(manager, socket);
                            clientSocketHandler.handle();
                        }
                    });
            } else if (gameServer !== undefined && String(secretKey) === String(process.env.WEBSOCKET_SECRET_KEY)) {
                // В этом случае соединение инициировал игровой сервер.

                // FIXME: неправильно определяет тип
                // @ts-ignore
                manager.addGameServerToState(JSON.parse(gameServer));

                const gameServerSocketHandler = new GameServerSocketHandler(manager, socket);
                gameServerSocketHandler.handle();
            } else socket.disconnect(true);
        });
    }
   
    /**
     * Извлекает из документа пользователя необходимию для состояния информацию.
     *
     * @param user - документ пользователя
     * @returns объект с данными о пользоввателе
     */
    public static parseUserData(user: IDocumentUser): Shared.Interfaces.IUser {
        return {
            nickname: user.nickname,
            rating: user.rating,
            avatar: user.avatar
        };
    }

    public static create(io: Server): SocketManager {
        return new SocketManager(io, state);
    }
}
