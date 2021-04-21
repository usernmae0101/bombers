import React from "react";
import { useSelector } from "react-redux";

import { select_game_ping } from "../../../redux/selectors/game-selectors";
import styles from "./hud.module.scss";

const HUD = () => {
    const ping = useSelector(select_game_ping);

    return (
        <div className={styles.hud}>
            <div>бомбы: 1</div>
            <div>cкорость: 1</div>
            <div>радиус: 1</div>
            <div>пинг: { ping }</div>
        </div>
    );
};

export default HUD;