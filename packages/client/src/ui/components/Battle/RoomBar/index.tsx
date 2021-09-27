import React from "react";
import { useSelector } from "react-redux";

import styles from "./room-bar.module.scss";
import * as Shared from "@bombers/shared/src/idnex";
import * as GameSelecors from "@bombers/client/src/ui/redux/selectors/game-selectors";

const RoomBar = () => {
    const TCPSocket = useSelector(GameSelecors.select_game_tcp_socket);

    const onLeaveRoom = () => {
        TCPSocket.emit(
            String(Shared.Enums.SocketChannels.GAME_ON_LEAVVE_ROOM)
        );
    };

    return (
        <div className={styles.bar}>
            <span onClick={onLeaveRoom}>(крестик)</span>
        </div>
    );
};

export default RoomBar;
