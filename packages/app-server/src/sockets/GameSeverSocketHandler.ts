import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import * as Shared from "@bombers/shared/src/idnex";

/**
 * Обрабатывает сообщения игрового сервера по веб-сокету.
 */
export default class GameServerSocketHandler {
    public static handle(socket: Socket, manager: SocketManager) {
        socket.on(
            String(Shared.Enums.SocketChannels.APP_ON_GAME_AUTH),
            () => {}
        )
    }
}