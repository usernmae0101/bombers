import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import BaseSocketHandler from "./BaseSocketHandler";
import * as Shared from "@bombers/shared/src/idnex";

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
