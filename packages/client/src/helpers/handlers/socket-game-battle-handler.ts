import { Dispatch } from "redux";
import { Socket } from "socket.io-client";
import geckos, { ClientChannel } from '@geckos.io/client'

import * as Shared from "@bombers/shared/src/idnex";
import Game from "../../game/Game";
import * as GameActions from "../../ui/redux/actions/game-actions";

interface IJoinRoomData {
    /** Цвет игрока. */
    color: Shared.Enums.PlayerColors;
    /** UDP порт, чтобы установить второе (ненадёжное) соединение. */
    UDP_port: number;
    /** Список ICE серверов (TURN для p2p). */
    iceServers: any[];
    /** Игровые слоты. */
    slots: Shared.Interfaces.IGameSlots;
}

let pingTimestamp: number = null;

// пингуем сервер
const ping = (socket: Socket) => {
    pingTimestamp = Date.now();
    socket.emit(String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG));
};

export const startHandlingGameBattleSocket = (
    userToken: string,
    address: string,
    game: Game, 
    socket: Socket, 
    dispatch: Dispatch
): () => [NodeJS.Timeout, ClientChannel] => {
    let gameSocketUDP: ClientChannel;
    let isConnected: boolean = false;
    let pingInterval: NodeJS.Timeout = null;

    // получаем данные при успешном подключении к комнате
    socket.on(
        String(Shared.Enums.SocketChannels.GAME_ON_CONNECT_ROOM_DATA),
        (data: IJoinRoomData) => {
            dispatch(GameActions.action_game_set_slots(data.slots));
            dispatch(GameActions.action_game_set_color(data.color));

            // открываем UDP-соединение
            const UDPChann = geckos({
                url: `http://${address}`,
                port: data.UDP_port,
                iceServers: data.iceServers,
                authorization: userToken
            });

            game.color = data.color;
            game.UDPChann = UDPChann;

            UDPChann.onConnect(() => {
                ping(socket);
                pingInterval = setInterval(ping, 5000, socket);
            });
        }
    ); 
 
    // высчитываем сетевую задержку
    socket.on(
        String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG),
        () => {
            const latency = Date.now() - pingTimestamp;

            game.ping = latency;
            dispatch(GameActions.action_game_set_ping(latency));

            if (!isConnected) {
                isConnected = true;
                dispatch(GameActions.action_game_set_loading(false));
            }
        }
    );

    // обновляем игровые слоты
    socket.on(
        String(Shared.Enums.SocketChannels.GAME_ON_UPDATE_GAME_ROOM_SLOTS),
        (slots: Shared.Interfaces.IGameSlots) => {
            dispatch(GameActions.action_game_set_slots(slots));
        }
    )

    return function() {
        return [pingInterval, gameSocketUDP];
    }
};
