import React from "react";

import styles from "./loader.module.scss";

const Loader = () => {
    return (
        <figure>
            <div className={`${styles.dot} ${styles.white}`}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </figure>
    );
};

export default Loader;
