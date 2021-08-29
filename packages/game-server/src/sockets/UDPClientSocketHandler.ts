import { ServerChannel } from "@geckos.io/server";

import * as Shared from "@bombers/shared/src/idnex";
import Room from "../Room";

export default class UDPClientSocketHandler {    
    public static handle(socket: ServerChannel, gameRoom: Room) {
        const token: string = socket.userData.token;

        socket.on(
            String(Shared.Enums.SocketChannels.GAME_ON_SEND_INPUT_KEYS),
            (keysData: Shared.Interfaces.IKeysData) => gameRoom.onKeys(token, keysData)
        )
    }
}
