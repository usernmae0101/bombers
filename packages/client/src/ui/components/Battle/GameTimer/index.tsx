import React from "react";
import { useSelector } from "react-redux";

import * as Shared from "@bombers/shared/src/idnex";
import * as GameSelectors from "../../../redux/selectors/game-selectors";
import styles from "./game-timer.module.scss";
import { debug } from "@bombers/shared/src/tools/debugger";

const CELLS = Shared.Helpers.getTotalMapCells();

const GameTimer = () => {
    const [minutes, setMinutes] = React.useState(null);
    const [seconds, setSeconds] = React.useState(null);
    
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
        <div className={styles.timer}>
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
        </div>
    );
};

export default GameTimer;
