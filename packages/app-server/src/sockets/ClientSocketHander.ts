import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import BaseSocketHandler from "./BaseSocketHandler";
import * as Shared from "@bombers/shared/src/idnex";

interface IPaginationData {
    paginationPage: number;
    paginationItems: number;
}

/**
 * Обрабатывает сообщения клиента по веб-сокету.
 */
export default class ClientSocketHandler extends BaseSocketHandler {
    constructor(manager: SocketManager, socket: Socket) {
        super(manager, socket);
    }

    public handle(currentSocketUserData: Shared.Interfaces.IUser) {
        // обновляем состояние приложения, если пользователь отключился
        this.socket.on("disconnect", () => { 
            this.manager.removeUserFromState(currentSocketUserData);
        });

        // получение серверов
        this.socket.on(String(Shared.Enums.SocketChannels.APP_ON_GET_PORTION_GAME_SERVERS), (data: IPaginationData) => {
            const { paginationPage, paginationItems } = data;

            const sliceFrom = paginationPage * paginationItems - paginationItems;
            const sliceTo = paginationPage * paginationItems;

            let servers: Shared.Interfaces.ILobbyServer[] = this.manager.state.lobby.slice(
                ...(
                    this.manager.state.lobby.length < sliceTo ? [-paginationItems] : [sliceFrom, sliceTo]
                )
            );

            this.socket.emit(String(Shared.Enums.SocketChannels.APP_ON_GET_PORTION_GAME_SERVERS), servers);
        });

        // обрабатываем сообщение, которое пользователь отправил из чата
        this.socket.on(String(Shared.Enums.SocketChannels.APP_ON_ADD_CHAT_MESSAGE), (message: string) => {
            this.manager.addMessageToState({
                author: currentSocketUserData,
                message: message.slice(0, Shared.Constants.CHAT_MAX_MESSAGE_LENGTH),
                date: Date.now()
            });
        });
    }
}
