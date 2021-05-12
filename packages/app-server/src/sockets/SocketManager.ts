import { Server } from "socket.io";

import * as Shared from "@bombers/shared/src/idnex";
import { state } from "./state";
import { UserModel, IDocumentUser } from "../api/models";
import ClientSocketHandler from "./ClientSocketHander";
import GameServerSocketHandler from "./GameSeverSocketHander";

export default class SocketManager {
    constructor(
        public io: Server,
        public state: Shared.Interfaces.IServerAppState
    ) { }

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
    
    public addMessageToState(message: Shared.Interfaces.IChatMessage) {
        // циклический буфер
        const circularBuffer = (this.state.chat.messages.length + 1) % (Shared.Constants.CHAT_MESSAGES_BUFFER_SIZE + 1);
       
        this.state.chat.messages[
            circularBuffer === 0 ? 0 : circularBuffer - 1
        ] = message;
        this.io.emit(String(Shared.Enums.SocketChannels.APP_ON_ADD_CHAT_MESSAGE), message);
    }
    
    public addGameServerToState(server: Shared.Interfaces.ILobbyServer) {
        this.state.lobby.push(server);
        this.io.emit(String(Shared.Enums.SocketChannels.APP_ON_SET_GAME_SERVERS_COUNT), this.state.lobby.length);
    }

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
                            socket.emit(String(Shared.Enums.SocketChannels.APP_ON_SET_STATE), {
                                online: manager.state.online,
                                chat: manager.state.chat,
                                totalServers: manager.state.lobby.length
                            });
 
                            const clientSocketHandler = new ClientSocketHandler(manager, socket);
                            clientSocketHandler.handle(currentSocketUserData);
                        }
                    });
            // В этом случае соединение инициировал игровой сервер.
            } else if (gameServer !== undefined && String(secretKey) === String(process.env.WEBSOCKET_SECRET_KEY)) {
                manager.addGameServerToState(JSON.parse(gameServer as string));

                const gameServerSocketHandler = new GameServerSocketHandler(manager, socket);
                gameServerSocketHandler.handle();
            } else socket.disconnect(true);
        });
    }
   
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
