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
    }
}
