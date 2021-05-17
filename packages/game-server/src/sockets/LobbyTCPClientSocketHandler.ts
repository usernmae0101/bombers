import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import * as Shared from "@bombers/shared/src/idnex";

/**
 * Обрабатыает сообщения клиента по веб-сокету (подключенного к лобби).
 */
export default class LobbyTCPClientSocketHandler {
    public static handle(socket: Socket, manager: SocketManager) {
        // отвечаем на пинг
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG), 
            () => manager.pong("lobby")
        );        
    }
}
