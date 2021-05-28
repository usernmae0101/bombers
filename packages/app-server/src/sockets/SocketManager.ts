import { Server } from "socket.io";

import * as Shared from "@bombers/shared/src/idnex";
import { UserModel, IDocumentUser } from "../api/models";
import ClientSocketHandler from "./ClientSocketHandler";
import GameServerSocketHandler from "./GameSeverSocketHandler";

export default class SocketManager {
    /**
     * @param io - socket.io instance 
     * @param state - общее состояние приложения
     */
    constructor(public io: Server, public state: Shared.Interfaces.IServerAppState) { }

    /**
     * Меняет состояние приложения при отключении пользователя от сокета. 
     * Удаляет пользователя из списка участников чата, уменьшает онлайн. 
     * Отправляет обновлённое состояние всем подключенным сокетам.
     * 
     * @param userData - данные отключенного пользователя
     */
    public removeUserFromState(userData: Shared.Interfaces.IUser) {
        --this.state.online;
        this.io.of("client").emit(
            String(Shared.Enums.SocketChannels.APP_ON_SET_ONLINE),
            this.state.online
        );

        // обновляем список участников чата
        this.state.chat.members = this.state.chat.members.filter(member => {
            if (member.nickname === userData.nickname) {
                this.io.of("client").emit(
                    String(Shared.Enums.SocketChannels.APP_ON_REMOVE_CHAT_MEMBER),
                    member.nickname
                );
                return false;
            } 
            
            return true;
        });
    }

    /**
     * Меняет состояние приложения при отправке пользователем  
     * сообщения в общий чат. Записывает сообщение в циклический 
     * буфер. Отправляет сообщение всем подключенным сокетам.
     * 
     * @param message - сообщение, отправленное пользователем
     */
    public addMessageToState(message: Shared.Interfaces.IChatMessage) {
        // циклический буфер
        const circularBuffer = (this.state.chat.messages.length + 1) % (Shared.Constants.CHAT_MESSAGES_BUFFER_SIZE + 1);

        this.state.chat.messages[
            circularBuffer === 0 ? 0 : circularBuffer - 1
        ] = message;

        this.io.of("client").emit(
            String(Shared.Enums.SocketChannels.APP_ON_ADD_CHAT_MESSAGE),
            message
        );
    }

    /**
     * Меняет состояние приложения при подключении нового игрового 
     * сервера к центральному серверу. Добавляет игровой сервер в лобби. 
     * Отправляет обновлённое количество игровых серверов всем подключнным сокетам.
     * 
     * @param server - подключеный игровой сервер
     */
    public addGameServerToState(server: Shared.Interfaces.ILobbyServer) {
        this.state.lobby.push(server);
        this.io.of("client").emit(
            String(Shared.Enums.SocketChannels.APP_ON_SET_GAME_SERVERS_COUNT),
            this.state.lobby.length
        );
    }

    /**
     * Меняет состояние приложения при подключении нового пользователя к сокету. 
     * Увеличивает онлайн. Если пользователь не находится в игре, добавляет
     * в список участников чата. Отправляет обновлённое состояние всем подключенным сокетам.
     * 
     * @param userData - данные подключеннного пользователя
     */
    public addUserToState(userData: Shared.Interfaces.IUser) {
        ++this.state.online;
        this.io.of("client").emit(
            String(Shared.Enums.SocketChannels.APP_ON_SET_ONLINE),
            this.state.online
        );

        // TODO: добавить проверку, в игре ли пользователь (вылетел)
        // если в игре, то переместить сразу в игровую команту

        if (true) {
            this.state.chat.members.push(userData);
            this.io.of("client").emit(
                String(Shared.Enums.SocketChannels.APP_ON_ADD_CHAT_MEMBER),
                userData
            );
        }
    }

    /**
     * Обрабатывает подключения к сокету на центральном сервере.
     */
    public handle() {
        // Соединение инициировал клиент.
        this.io.of("client").on("connection", socket => {
            const { authToken } = socket.handshake.query;

            if (authToken) {
                UserModel.findOne({ _id: authToken })
                    .then(user => {
                        // Если токен невалидный (пользователь не найден в БД) - отключаем пользователя.
                        if (!user) socket.disconnect(true);
                        else {
                            const currentSocketUserData = this.parseUserData(user);

                            this.addUserToState(currentSocketUserData);

                            // отправляем подключенному пользователю текущее состояние приложения
                            socket.emit(String(Shared.Enums.SocketChannels.APP_ON_SET_STATE), {
                                online: this.state.online,
                                chat: this.state.chat,
                                totalServers: this.state.lobby.length
                            });

                            ClientSocketHandler.handle(socket, this, currentSocketUserData);
                        }
                    });
            } 
            
            else socket.disconnect(true);
        });

        // Соединение инициировал игровой сервер.
        this.io.of("game-server").on("connection", socket => {
            const { gameServer } = socket.handshake.query;

            if (gameServer !== undefined) {
                this.addGameServerToState(JSON.parse(gameServer as string));

                GameServerSocketHandler.handle(socket, this);
            } 
            
            else socket.disconnect(true);
        });
    }

    /**
     * Извлекает из mongoose-документа данные пользователя.
     * 
     * @param userDocument - mongoose-документ пользователя
     * @returns данные пользователя
     */
    public parseUserData(userDocument: IDocumentUser): Shared.Interfaces.IUser {
        return {
            nickname: userDocument.nickname,
            rating: userDocument.rating,
            avatar: userDocument.avatar
        };
    }
}
