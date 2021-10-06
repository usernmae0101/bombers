import React from "react";
import { useSelector } from "react-redux";

import * as Shared from "@bombers/shared/src/idnex";
import * as GameSelectors from "../../../redux/selectors/game-selectors";
import styles from "./game-hud.module.scss";
import { debug } from "@bombers/shared/src/tools/debugger";

const CELLS = Shared.Helpers.getTotalMapCells();

const GameHUD = () => {
    const [minutes, setMinutes] = React.useState(null);
    const [seconds, setSeconds] = React.useState(null);
    
    const ping = useSelector(GameSelectors.select_game_ping);
    const bombs = useSelector(GameSelectors.select_game_bombs);
    const speed = useSelector(GameSelectors.select_game_speed);
    const radius = useSelector(GameSelectors.select_game_radius);
    const wallTimestamp = useSelector(GameSelectors.select_wall_timestamp);
    
    const tickWallTimer = () => {
        const duration = ((Date.now() - wallTimestamp) / 1000) >> 0;
        const rest = CELLS - duration;

        debug(
            "Another tick of the timer has passed",
            `duration: ${duration}`,
            `rest: ${rest}`
        ); 

        // таймер ещё идёт, пересчитываем и запускаем снова
        if (duration < CELLS) {
            setMinutes((rest / 60) >> 0);
            setSeconds(rest % 60);

            setTimeout(tickWallTimer, 1000);
        }

        // таймер кончился, обнуляем
        else {
            setMinutes(null);
            setSeconds(null);
        }
    };

    React.useEffect(() => {
        wallTimestamp && tickWallTimer();
    }, []);

    React.useEffect(() => {
        debug(
            "Wall timestamp has been changed",
            `timestamp: ${wallTimestamp}`
        );

        wallTimestamp && tickWallTimer();
    }, [wallTimestamp]);

    return (
        <div className={styles.hud}>
            <div data-item={"bombs"}>бомбы: {bombs}</div>
            <div data-item={"speed"}>cкорость: {speed}</div>
            <div data-item={"radius"}>радиус: {radius}</div>
            <div>
                <span>
                    {
                        minutes === null ? 
                            "00" : 
                            "0" + minutes
                    }
                </span>
                <span>:</span>
                <span>
                    {
                        seconds === null ? 
                            "00" : 
                            (
                                seconds.toString().length === 1 ? 
                                "0" + seconds : 
                                seconds
                            )
                    }
                </span>
            </div>
            <div>пинг: {ping}</div>
        </div>
    );
};

export default GameHUD;
