import React from "react";
import { useSelector } from "react-redux";

import * as DashboardSelectors from "../../redux/selectors/dashboard-selctors";
import * as UserSelecors from "../../redux/selectors/user-selecrots";

const Dashboard = () => {
    const userData = useSelector(UserSelecors.select_user_data_all);
    const online = useSelector(DashboardSelectors.select_dashboard_online);
    const totalServers = useSelector(DashboardSelectors.select_dashboard_total_servers);
    
    return (
        <div className="dashboard">
            <div>
                <img src={ userData.avatar }/>
                <span>{ userData.nickname }</span>
                <span>{ userData.rating }</span>
            </div>
            <div>
                <span>{ totalServers }</span>
                <span>{ online }</span>
                <button>играть</button>
            </div>
        </div>
    );
};

export default Dashboard;
