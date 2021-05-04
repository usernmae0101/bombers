import React from "react";

import styles from "./game.module.scss";

const Game = () => {
    return (
        <div className={styles.game}>
            <div className={styles.menu}>
                
            </div>
            <div className={styles.canvas} id="cnv"></div>
        </div>
    );
};

export default Game;