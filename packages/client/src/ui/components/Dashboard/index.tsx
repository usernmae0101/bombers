import React from "react";
import { useSelector } from "react-redux";

import imgRating from "@bombers/client/assets/images/rating.png";
import * as DashboardSelectors from "../../redux/selectors/dashboard-selctors";
import * as UserSelecors from "../../redux/selectors/user-selecrots";
import styles from "./dashboard.module.scss";

const Dashboard = () => {
    const userData = useSelector(UserSelecors.select_user_data_all);
    const online = useSelector(DashboardSelectors.select_dashboard_online);
    const totalServers = useSelector(DashboardSelectors.select_dashboard_total_servers);
    
    return (
        <div className={styles.dashboard}>
            <div className={styles.avatar}>
                <img src={userData.avatar} />
            </div>

            <div className={styles.nickname}>
                {userData.nickname}
            </div>

            <div className={styles.rating}>
                <img src={imgRating} />
                <div>{userData.rating}</div>
            </div>

            <div className={styles.servers}>
                servers: { totalServers }
            </div>

            <div className={styles.users}>
                users: { online }
            </div>
        </div>
    );
};

export default Dashboard;
