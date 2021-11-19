import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Line, Doughnut } from "react-chartjs-2";

import styles from "./profile-statistic.module.scss";
import * as ProfileSelectors from "@bombers/client/src/ui/redux/selectors/profile-selectors";
import * as ProfileActions from "@bombers/client/src/ui/redux/actions/profile-actions";

const ProfileStatistic: React.FC<{
    nickname: string;
}> = ({ nickname }) => {
    const dispatch = useDispatch();

    const statistic = useSelector(ProfileSelectors.select_profile_statistic_data);
    const isFetching = useSelector(ProfileSelectors.select_profile_statistic_is_fetching);

    React.useEffect(
        () => {
            dispatch(
                ProfileActions.action_profile_fetch_statistic(nickname)
            );

            return () => {
                dispatch(
                    ProfileActions.action_profile_set_statistic_is_fetching(true)
                );
            };
        },
        []
    );

    if (isFetching) {
        return (<div>Loading...</div>);
    }

    return (
        <div className={styles.statistic}>
            <div className={styles.rating}>
                <div>График изменения рейтинга</div>
                <Line 
                    data={{
                        labels: statistic.ratingDataset.map((_, i) => i + 1),
                        datasets: [
                            {   
                                label: "За последние 100 матчей",
                                data: statistic.ratingDataset,
                                fill: false,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            }
                        ]
                    }}
                    options={{ 
                        responsive: false,
                        maintainAspectRatio: false
                    }}
                    redraw={false}
                />
            </div>

            <div className={styles.places}>
                <div>Всего матчей: {statistic.totalMatches}</div>
                <Doughnut 
                    data={{
                        labels: ["1 мест", "2 мест", "3 мест", "4 мест"],
                        datasets: [
                            {
                                data: statistic.placesDataset,
                                backgroundColor: [
                                    'rgb(255, 99, 132)',
                                    'rgb(54, 162, 235)',
                                    'rgb(255, 205, 86)',
                                    'rgb(25, 68, 86)'
                                ],
                                hoverOffset: 4
                            }
                        ]
                    }}
                    options={{ 
                        responsive: false,
                        maintainAspectRatio: false
                    }}
                    redraw={false}
                />
            </div>
        </div>
    );
};

export default ProfileStatistic;
