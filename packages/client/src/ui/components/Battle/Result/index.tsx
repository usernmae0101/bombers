import React from "react";

import styles from "./result.module.scss";

const ResultPlayer: React.FC<{
    nickname: string;
    rating: number;
}> = ({ nickname, rating }) => {
    return (
        <li>
            <div>
                <span>{nickname}</span>
                <span>{rating}</span>
            </div>
        </li>
    );
};

const Result: React.FC<{ battleResult: any[]; }> = ({ battleResult }) => {
    return (
        <div className={styles.result}>
            <ul>
                {
                    battleResult.map(player => {
                        return <ResultPlayer key={player.nickname} {...player} />
                    })
                }
            </ul>
        </div>
    );
};

export default Result;
