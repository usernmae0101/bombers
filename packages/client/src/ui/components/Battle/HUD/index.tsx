import React from "react";
import { useSelector } from "react-redux";

import * as GameSelectors from "../../../redux/selectors/game-selectors";
import styles from "./hud.module.scss";

const HUD = () => {
    const ping = useSelector(GameSelectors.select_game_ping);
    const bombs = useSelector(GameSelectors.select_game_bombs);
    const speed = useSelector(GameSelectors.select_game_speed);
    const radius = useSelector(GameSelectors.select_game_radius);

    return (
        <div className={styles.hud}>
            <div data-item={"bombs"}>бомбы: {bombs}</div>
            <div data-item={"speed"}>cкорость: {speed}</div>
            <div data-item={"radius"}>радиус: {radius}</div>
            <div>пинг: {ping}</div>
        </div>
    );
};

export default HUD;