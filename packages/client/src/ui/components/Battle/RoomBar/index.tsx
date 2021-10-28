import React from "react";
import { useSelector } from "react-redux";

import imgPing from "@bombers/client/assets/images/ping.png";
import imgExit from "@bombers/client/assets/images/exit.png";
import styles from "./room-bar.module.scss";
import * as Shared from "@bombers/shared/src/idnex";
import * as GameSelectors from "@bombers/client/src/ui/redux/selectors/game-selectors";
import GameHUD from "../GameHUD";
import GameTimer from "../GameTimer";

const ExitButton = () => {
    const TCPSocket = useSelector(GameSelectors.select_game_tcp_socket);

    const onLeaveRoom = () => {
        TCPSocket.emit(
            String(Shared.Enums.SocketChannels.GAME_ON_LEAVVE_ROOM)
        );
    };

    return (
        <div 
            className={styles.exit}
            title="выход"
        >
            <img
                onClick={onLeaveRoom}
                src={imgExit} 
            />
        </div>
    );
};

const PingInfo = () => {
    const ping = useSelector(GameSelectors.select_game_ping);
    
    return(
        <div 
            className={styles.ping}
            title="пинг"
        >
            <img src={imgPing} />
            <div>{ping}</div>
        </div>
    );
};

const RoomBar = () => (
    <div className={styles.bar}>
        <GameHUD />
        <GameTimer />
        <div className={styles.helpers}>
            <ExitButton />
            <PingInfo />
        </div>
    </div>
);

export default RoomBar;
