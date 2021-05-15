import { Dispatch } from "redux";
import { Socket } from "socket.io-client";

import * as Shared from "@bombers/shared/src/idnex";
import Game from "../../game/Game";
import * as GameActions from "../../ui/redux/actions/game-actions";

export const startHandlingGameBattleSocket = (
    game: Game, 
    socket: Socket, 
    dispatch: Dispatch
): () => NodeJS.Timeout => {
    let isConnected: boolean = false;
    let pintInterval: NodeJS.Timeout = null;
    let pingTimestamp: number = null;

    socket.on(
        String(),
        () => {}
    ); 
 
    // высчитываем сетевую задержку
    socket.on(
        String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG),
        () => {
            let latency = Date.now() - pingTimestamp;

            game.ping = latency;
            dispatch(GameActions.action_game_set_ping(latency));
        }
    );

    return function() {
        return pintInterval;
    }
};