import { ServerChannel } from "@geckos.io/server";

import * as Shared from "@bombers/shared/src/idnex";
import Room from "../Room";
import { debug } from "@bombers/shared/src/tools/debugger";

export default class UDPClientSocketHandler {    
    public static connections: { [token: string]: any; } = {}
   
    /**
     * Добавляет сокет в список подключенных к серверу. Если сокет уже 
     * есть в списке, отключает предыдущий и перезписывает новым подключением.
     *
     * @param token - авторизационный токен пользователя
     * @param socket - подключенный сокет пользователя
     */
    public static addSocketToConnectionSotre(
        token: string, 
        socket: any
    ) {
        if (this.connections[token]) {
            debug(
                "Socket UDP already in connection list",
                `token: ${token}`,
                "Disconnecting..."
            );

            this.connections[token].close();
        }

        this.connections[token] = socket;
        
        debug(
            "Socket UDP connected", 
            `token: ${token}`
        );
    }

    public static handle(
        socket: ServerChannel, 
        gameRoom: Room
    ) {
        const token: string = socket.userData.token;

        this.addSocketToConnectionSotre(token, socket);
        
        socket.onDisconnect(() => {
            debug(
               "Disconnected UDP socket",
               `token: ${token}`
            );
        });

        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_SEND_INPUT_KEYS),
            (keysData: Shared.Interfaces.IKeysData) => gameRoom.onKeys(token, keysData)
        )
    }
}
