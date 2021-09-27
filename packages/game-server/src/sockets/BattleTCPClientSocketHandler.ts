import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import * as Shared from "@bombers/shared/src/idnex";
import Room from "../Room";
import { debug } from "@bombers/shared/src/tools/debugger";
import UDPClientSocketHandler from "./UDPClientSocketHandler";

/**
 * Обрабатыает сообщения клиента по веб-сокету (подключенного к игровой команте).
 */
export default class BattleTCPClientSocketHandler {
    public static connections: { [token: string]: any; } = {}
    
    /**
     * Добавляет сокет в список подключенных к серверу. Если сокет уже 
     * есть в списке, отключает предыдущий и перезписывает новым подключением.
     *
     * @param token - авторизационный токен пользователя
     * @param socket - подключенный сокет пользователя
     */
    public static addSocketToConnectionSotre(token: string, socket: any) {
        if (this.connections[token]) {
            debug(
                "Socket TCP already in connection list",
                `token: ${token}`,
                "Disconnecting..."
            );

            this.connections[token].disconnect();
        }

        this.connections[token] = socket;
        
        debug("Socket TCP connected", `token: ${token}`);
    }
  
    /**
     * Срабатыват при подтверждении от центрального сервера, 
     * о том, что пользователь покинул комнату.
     *
     * @param token - авторизационный токен пользователя
     */
    public static confirmUserDisconnection(token: string) {
        debug(
            "Leaves room", 
            `token: ${token}`
        );

        if (this.connections[token]) {
            this.connections[token].emit(
                String(Shared.Enums.SocketChannels.GAME_ON_LEAVVE_ROOM),
            );
            this.connections[token].disconnect();
        }
    }

    public static handle(socket: Socket, manager: SocketManager, gameRoom: Room) {
        const token: string = socket.handshake.auth.token;
   
        this.addSocketToConnectionSotre(token, socket);

        // меняем эмоцию игрока
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_EMOTION_UPDATE),
            (emotion: number) => gameRoom.onEmotionChange(token, emotion)
        );
        
        socket.on("disconnect", () => {
            debug(
                "Disconnected TCP socket",
                `token: ${token}`
            );

            UDPClientSocketHandler.connections[token]?.close();
        });

        // покидаем комнату
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_LEAVVE_ROOM),
            () => {
                // удаяем пользователя из комнаты на центральном сервере
                manager.clientSocketTCP.emit(
                    String(Shared.Enums.SocketChannels.GAME_ON_LEAVVE_ROOM),
                    token
                );
            }
        );

        // отвечаем на пинг
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG), 
            () => manager.pong("battle") 
        );  

        // принимаем готовность к игре
        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_READY_TO_PLAY),
            () => gameRoom.onReady(token)
        )
    }
}
