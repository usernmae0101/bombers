import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import BaseSocketHandler from "./BaseSocketHandler";

/**
 * Обрабатывает сообщения клиента по веб-сокету.
 */
export default class ClientSocketHandler extends BaseSocketHandler {
    constructor(manager: SocketManager, socket: Socket) {
        super(manager, socket);
    }

    public handle() {
        
    }
}