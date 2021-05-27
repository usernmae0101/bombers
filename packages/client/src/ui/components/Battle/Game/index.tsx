import React from "react";
import { useSelector } from "react-redux";

import * as Shared from "@bombers/shared/src/idnex";
import * as GameSelecors from "../../../redux/selectors/game-selectors";
import styles from "./game.module.scss";

const Canvas = React.memo(() => {
    const canvasBackgroundImgStyles: React.CSSProperties = {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 0
    };

    return (
        <div className={styles.canvas} id="cnv">
            <img 
                src={Shared.Constants.GAME_RESOURCES_IMAGE_GRASS}
                style={canvasBackgroundImgStyles}
            />
        </div>
    );
});

const Game = () => {
    const localColor = useSelector(GameSelecors.select_game_color);
    const gameSlots = useSelector(GameSelecors.select_game_slots);
    const TCPSocket = useSelector(GameSelecors.select_game_tcp_socket);

    const readyToPlay = () => {
        TCPSocket.emit(
            String(Shared.Enums.SocketChannels.GAME_ON_READY_TO_PLAY)
        );
    };

    return (
        <div className={styles.game}>
            <div className={styles.menu}>
                {!gameSlots[localColor].isReady && <button onClick={readyToPlay}>играть</button>}
            </div>
            <Canvas />
        </div>
    );
};

export default Game;
