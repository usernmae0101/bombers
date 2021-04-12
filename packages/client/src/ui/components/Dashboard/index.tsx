import React from "react";
import { useSelector } from "react-redux";
import { select_dashboard_online_chat, select_dashboard_online_game } from "../../redux/selectors/dashboard-selctors";
import { select_user_data_all } from "../../redux/selectors/user-selecrots";

const Dashboard = () => {
    const userData = useSelector(select_user_data_all);
    const onlineChat = useSelector(select_dashboard_online_chat);
    const onlineGame = useSelector(select_dashboard_online_game);

    return (
        <div className="dashboard">
            <div>
                <img src={userData.avatar}/>
                <span>{userData.nickname}</span>
                <span>{userData.rating}</span>
            </div>
            <div>
                <span>{onlineChat}</span>
                <span>{onlineGame}</span>
                <button>играть</button>
            </div>
        </div>
    );
};

export default Dashboard;
