import { Dispatch } from "redux";
import { Socket } from "socket.io-client";
import geckos, { ClientChannel } from '@geckos.io/client'
import Serializer from "array-buffer-serializer";

import * as Shared from "@bombers/shared/src/idnex";
import Game from "../game/Game";
import * as GameActions from "../ui/redux/actions/game-actions";

interface IConnectRoomData {
    /** Цвет игрока, выделенный сервером для пользователя. */
    color: Shared.Enums.PlayerColors;
    /** UDP порт, чтобы установить второе (ненадёжное) соединение. */
    UDP_port: number;
    /** Список ICE серверов (необходим TURN для соединения p2p). */
    iceServers: any[];
    /** Состояние игровых слотов в комнате. */
    slots: Shared.Interfaces.IGameSlots;
    /** Игровое состояние. */
    gameState: Shared.Interfaces.IGameState;
    /** Статус игры: начата или нет. */
    isGameStarted: boolean;
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
        (data: IConnectRoomData) => {
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
            game.state = data.gameState;

            data.isGameStarted && game.start();

            UDPChann.onConnect(() => {
                ping(socket);
                pingInterval = setInterval(ping, 5000, socket);

                // получаем изменения игрового состояния
                UDPChann.on(
                    String(Shared.Enums.SocketChannels.GAME_ON_UPDATE_GAME_STATE),
                    (buffer: any) => {
                        game.onNotReliableStateChanges(
                           buffer
                        );
                    }
                )
            });
        }
    );
    
    // получаем изменения игрового состояния
    socket.on(
        String(Shared.Enums.SocketChannels.GAME_ON_UPDATE_GAME_STATE),
        (buffer: any) => {
            game.onReliableStateChanges(
                buffer, 
                dispatch
            )
        }
    )

    // высчитываем сетевую задержку
    socket.on(
        String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG),
        () => {
            const latency = Date.now() - pingTimestamp;

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

    // запускаем игру
    socket.on(
        String(Shared.Enums.SocketChannels.GAME_ON_START),
        () => game.start()
    )

    return function () {
        return [pingInterval, gameSocketUDP];
    }
};
