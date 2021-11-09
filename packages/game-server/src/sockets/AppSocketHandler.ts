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
                    manager.sendRoomDataToConnectedUser(
                        authSocket, 
                        gameRoom, 
                        gameRoom.users[responseData.token].color
                    );
   
                    BattleTCPClientSocketHandler.handle(authSocket, manager, gameRoom);
                }
            }
        );

        // получаем результат игры
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_END),
            (result: any[]) => gameRoom.onResult(result)
        );

        // игрок покидает комнату
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_LEAVVE_ROOM),
            (token: string) => {
                BattleTCPClientSocketHandler.confirmUserDisconnection(token)

                gameRoom.onLeave(token);
            }
        );
    }
}
