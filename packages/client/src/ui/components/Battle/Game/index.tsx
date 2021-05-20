import React from "react";
import { useSelector } from "react-redux";

import * as Shared from "@bombers/shared/src/idnex";
import * as GameSelecors from "../../../redux/selectors/game-selectors";
import styles from "./game.module.scss";

const Canvas = React.memo(() => {
    const canvasWrapperStyles = {
        background: `url(${Shared.Constants.GAME_RESOURCES_IMAGE_GRASS}) 100% 100%`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    };

    return (
        <div className={styles.canvas} style={canvasWrapperStyles} id="cnv"></div>
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
                { !gameSlots[localColor].isReady && <button onClick={readyToPlay}>играть</button>}
            </div>
            <Canvas />
        </div>
    );
};

export default Game;
