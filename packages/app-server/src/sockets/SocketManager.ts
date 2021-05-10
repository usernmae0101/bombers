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
     * Добавляет игровой сервер в лобби на центральном сервре. 
     * 
     * @param server - игровой сервер
     */
    public addGameServerToState(server: Shared.Interfaces.ILobbyServer) {
        this.state.lobby.push(server);
        this.io.emit(String(Shared.Enums.SocketChannels.APP_ON_ADD_GAME_SERVER), server);
    }

    public removeUserFromState(userData: Shared.Interfaces.IUser) {
        --this.state.online;
        this.io.emit(String(Shared.Enums.SocketChannels.APP_ON_SET_ONLINE), this.state.online);
   
        // обновляем список участников чата
        this.state.chat.members = this.state.chat.members.filter(member => {
            if (member.nickname === userData.nickname) {
                this.io.emit(String(Shared.Enums.SocketChannels.APP_ON_REMOVE_CHAT_MEMBER), member.nickname);
                return false;
            } else return true;
        });
    }

    /**
     * Добавляет пользователя в список участников чата
     * и увеличивает онлайн в стейте приложения.
     *
     * @param user - добавляемый пользователь
     */
    public addUserToState(user: Shared.Interfaces.IUser) {
        ++this.state.online;
        this.io.emit(String(Shared.Enums.SocketChannels.APP_ON_SET_ONLINE), this.state.online);

        // TODO: добавить проверку, в игре ли пользователь (вылетел)
        // если в игре, то переместить сразу в игровую команту
        if (true) {
            this.state.chat.members.push(user);
            this.io.emit(String(Shared.Enums.SocketChannels.APP_ON_ADD_CHAT_MEMBER), user);
        }
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
                            const currentSocketUserData = this.parseUserData(user);

                            manager.addUserToState(currentSocketUserData);

                            // отправляем подключенному пользователю текущее состояние приложения
                            socket.emit(String(Shared.Enums.SocketChannels.APP_ON_SET_STATE), manager.state);
 
                            const clientSocketHandler = new ClientSocketHandler(manager, socket);
                            clientSocketHandler.handle(currentSocketUserData);
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
