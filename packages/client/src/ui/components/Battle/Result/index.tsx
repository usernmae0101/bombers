import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./result.module.scss";
import * as UserSelectors from "@bombers/client/src/ui/redux/selectors/user-selecrots";
import * as UserActions from "@bombers/client/src/ui/redux/actions/user-actions";

const ResultPlayer: React.FC<{
    nickname: string;
    rating: number;
    points: number;
}> = ({ nickname, rating, points }) => {
    const dispatch = useDispatch();
    const userNickname = useSelector(UserSelectors.select_user_data_nickname);
    
    let className = styles.enemy;

    if (nickname === userNickname) {
        dispatch(UserActions.action_user_set_data_rating(rating));
        className = styles.me;
    }

    return (
        <li>
            <div className={className}>
                <span>{nickname}</span>
                <span>{rating}</span>
                <span>{points}</span>
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
