import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import * as Shared from "@bombers/shared/src/idnex";

/**
 * Обрабатыает сообщения, подключенного к игровой команте, клиента по веб-сокету.
 */
export default class BattleTCPClientSocketHandler {
    public static handle(socket: Socket, manager: SocketManager) {
        // отвечаем на пинг
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG), 
            () => manager.pong("battle")
        );  
    }
}
