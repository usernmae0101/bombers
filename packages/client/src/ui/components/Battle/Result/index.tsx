import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./result.module.scss";
import * as Shared from "@bombers/shared/src/idnex";
import * as UserSelectors from "@bombers/client/src/ui/redux/selectors/user-selecrots";
import * as UserActions from "@bombers/client/src/ui/redux/actions/user-actions";
import * as GameActions from "@bombers/client/src/ui/redux/actions/game-actions";

const ResultPlayer: React.FC<{
    userNickname: string;
    nickname: string;
    rating: number;
    points: number;
}> = ({ nickname, rating, points, userNickname }) => {
    const dispatch = useDispatch();
    
    let className = styles.enemy;
    if (nickname === userNickname) {
        // обновляем рейтинг в состоянии
        dispatch(
            UserActions.action_user_set_data_rating(rating)
        );

        className = styles.me;
    }

    return (
        <div className={className}>
            <div>{nickname}</div>
            <div>{rating}</div>
            <div>{points}</div>
        </div>
    );
};

const Result: React.FC<{ 
    battleResult: any[]; 
}> = ({ battleResult }) => {
    const dispatch = useDispatch();
   
    const userNickname = useSelector(UserSelectors.select_user_data_nickname);
    
    const [place, setPlace] = React.useState(0);
    const [isHideResult, setIsHideResult] = React.useState(false);

    React.useEffect(() => {
        battleResult.forEach(({nickname}, index) => {
            if (nickname === userNickname)
                setPlace(index + 1);
        });

        // обновляем игровые слоты
        dispatch(
            GameActions.action_game_set_slots(Shared.Slots.slots)
        ); 

        // обновляем статус загрузки игры
        dispatch(
            GameActions.action_game_set_loading(true)
        );
    }, []);
    
    if (isHideResult) { 
        return (null);
    }

    return (
        <div className={styles.result}>
            <div className={styles.place}>Вы заняли {place} место!</div>

            {
                battleResult.map(player => {
                    return (
                        <ResultPlayer 
                            key={player.nickname} 
                            { ...{ ...player, userNickname } } 
                        />
                    );
                })
            }

            <button
                className={styles.button}
                onClick={() => setIsHideResult(true)}
            >
                Закрыть
            </button>
        </div>
    );
};

export default Result;
