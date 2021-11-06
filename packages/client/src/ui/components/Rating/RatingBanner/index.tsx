import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./rating-banner.module.scss";
import * as RatingSelectors from "@bombers/client/src/ui/redux/selectors/rating-selectors";
import * as RatingActions from "@bombers/client/src/ui/redux/actions/rating-actions";

const RatingBanner = () => {
    const dispatch = useDispatch();
    
    const totalUsers = useSelector(RatingSelectors.select_total_users);

    React.useEffect(
        () => {
            return () => {
                dispatch(
                    RatingActions.action_rating_set_total_users(null)
                ); 
            };
        },
        []
    );

    return (
        <div className={styles.banner}>
            <div className={styles.label}>Рейтинг</div>
            <div className={styles.total}>{ totalUsers ? `Пользователей: ${totalUsers}` : "Loading..." }</div>
        </div>
    );
};

export default RatingBanner;
