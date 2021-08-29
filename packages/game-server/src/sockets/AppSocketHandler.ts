import { Socket } from "socket.io-client";

import SocketManager from "./SocketManager";
import * as Shared from "@bombers/shared/src/idnex";
import Room from "../Room";
import BattleTCPClientSocketHandler from "./BattleTCPClientSocketHandler";

/**
 * Обрабатывает сообщения центрального сервера по веб-сокету.
 */
export default class AppSocketHandler {
    public static handle(socket: Socket, manager: SocketManager, gameRoom: Room) {
        // получаем ответ на аутентификацию пользователя
        socket.on(
            String(Shared.Enums.SocketChannels.APP_ON_GAME_AUTH),
            (responseData: Shared.Interfaces.IRoomAuthResponseData) => {
                const authSocket = manager.getTCPSocketById(responseData.socketId);

                if (authSocket) {
                    // неуспешная аутентификация
                    if (!responseData.success) {
                        authSocket.disconnect();
                        return;
                    }
                    
                    // пока пользователь подключался, комната заполнилась
                    if (gameRoom.isLocked) {
                        authSocket.disconnect();
                        return;
                    }

                    gameRoom.onJoin(responseData.token, responseData.userData);
                    
                    authSocket.join("room");

                    // отправляем данные подключенному сокету
                    authSocket.emit(
                        String(Shared.Enums.SocketChannels.GAME_ON_CONNECT_ROOM_DATA),
                        {
                            color: gameRoom.users[responseData.token].color,
                            iceServers: manager.iceServers,
                            UDP_port: manager.UDP_port,
                            slots: gameRoom.slots,
                            gameState: gameRoom.gameState,
                            isGameStarted: gameRoom.isGameStarted
                        }
                    );

                    BattleTCPClientSocketHandler.handle(authSocket, manager, gameRoom);
                }
            }
        );
    }
}
