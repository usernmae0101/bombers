import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./game.module.scss";

const Game = () => {
    const dispatch = useDispatch();

    return (
        <div className={styles.game}>
            <div className={styles.menu}>
                
            </div>
            <div className={styles.canvas} id="cnv"></div>
        </div>
    );
};

export default Game;