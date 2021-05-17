import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import * as Shared from "@bombers/shared/src/idnex";
import Room from "../core/Room";

/**
 * Обрабатыает сообщения клиента по веб-сокету (подключенного к игровой команте).
 */
export default class BattleTCPClientSocketHandler {
    public static handle(socket: Socket, manager: SocketManager, gameRoom: Room) {
        const token: string = socket.handshake.auth.token;

        // отвечаем на пинг
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG), 
            () => manager.pong("battle")
        );  

        // принимаем готовность к игре
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_OM_READY_TO_PLAY),
            () => gameRoom.onReady(token)
        )
    }
}
