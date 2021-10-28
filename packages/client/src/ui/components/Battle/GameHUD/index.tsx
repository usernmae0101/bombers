import React from "react";
import { useSelector } from "react-redux";

import imgBombs from "@bombers/client/assets/images/bomb.png";
import imgSpeed from "@bombers/client/assets/images/speed.png";
import imgRadius from "@bombers/client/assets/images/radius.png";
import * as Shared from "@bombers/shared/src/idnex";
import * as GameSelectors from "../../../redux/selectors/game-selectors";
import styles from "./game-hud.module.scss";

const GameHUD = () => {
    const bombs = useSelector(GameSelectors.select_game_bombs);
    const speed = useSelector(GameSelectors.select_game_speed);
    const radius = useSelector(GameSelectors.select_game_radius);
    
    return (
        <div className={styles.hud}>
            <div 
                className={styles.item} 
                data-item={"bombs"}
                title="бомбы"
            >
                <img src={imgBombs} />
                <div>{bombs}</div>
            </div>

            <div 
                className={styles.item} 
                data-item={"speed"}
                title="скорость"
            >
                <img src={imgSpeed} />
                <div>{speed}</div>
            </div>

            <div 
                className={styles.item} 
                data-item={"radius"}
                title="радиус"
            >
                <img src={imgRadius} />
                <div>{radius}</div>
            </div>
        </div>
    );
};

export default GameHUD;
