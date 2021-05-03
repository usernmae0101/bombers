import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import BaseSocketHandler from "./BaseSocketHandler";

/**
 * Обрабатывает сообщения игрового сервера по веб-сокету.
 */
export default class GameServerSocketHandler extends BaseSocketHandler {
    constructor(manager: SocketManager, socket: Socket) {
        super(manager, socket);
    }

    public handle() {}
}