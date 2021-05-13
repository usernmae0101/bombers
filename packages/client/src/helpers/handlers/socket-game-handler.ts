import { Dispatch } from "redux";
import { Socket } from "socket.io-client";

import * as LobbyActions from "../../ui/redux/actions/lobby-actions";
import * as Shared from "@bombers/shared/src/idnex";

export const startHandlingGameLobbySocket = (address: string, socket: Socket, dispatch: Dispatch): () => NodeJS.Timeout => {
    let pingInterval: NodeJS.Timeout = null;
    let pingTimestamp: number = Date.now();

    // получаем состояние игровой комнаты
    socket.on(String(Shared.Enums.SocketChannels.GAME_ON_SET_ROOM_STATE), (room: Shared.Interfaces.IGameRoom) => {
        dispatch(LobbyActions.action_lobby_set_server_room(address, room));
        dispatch(LobbyActions.action_lobby_set_server_ping(address, Date.now() - pingTimestamp));
        dispatch(LobbyActions.action_lobby_set_server_connect_status(address, true));

        // пингуем игровой сервер
        pingInterval = setInterval(() => {
            pingTimestamp = Date.now();
            socket.emit(String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG));
        }, 5000);
    });

    // высчитываем сетевую задержку
    socket.on(String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG), () => {
        dispatch(LobbyActions.action_lobby_set_server_ping(address, Date.now() - pingTimestamp));
    });

    return function() {
        return pingInterval;
    }
};

export const startHandlingGameBattleSocket = () => {};