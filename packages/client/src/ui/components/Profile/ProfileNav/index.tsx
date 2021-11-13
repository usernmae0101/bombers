import React from "react";

import styles from "./profile-nav.module.scss";
import ProfileMatches from "./ProfileMatches";
import ProfileNotifications from "./ProfileNotifications";
import ProfileStatistic from "./ProfileStatistic";

const NAV_MATCHES = "matches";
const NAV_NOTIFICATIONS = "notifications";
const NAV_STATISTIC = "statistic";

const nav: { [id: string]: React.FC } = {
    [NAV_MATCHES]: ProfileMatches,
    [NAV_NOTIFICATIONS]: ProfileNotifications,
    [NAV_STATISTIC]: ProfileStatistic
};

const ProfileNav: React.FC<{
    nickname: string;
    localUserNickname: string;
}> = ({ nickname, localUserNickname }) => {
    const [navComponentId, setNavComponentId] = React.useState(NAV_MATCHES);

    const isLocalProfile = nickname === localUserNickname;
    const NavComponent = nav[navComponentId];

    return (
        <div className={styles.nav}>
            <div className={styles.header}>
                <div onClick={() => setNavComponentId(NAV_MATCHES)}>матчи</div>
                <div onClick={() => setNavComponentId(NAV_STATISTIC)}>статистика</div>
                { isLocalProfile && <div onClick={() => setNavComponentId(NAV_NOTIFICATIONS)}>уведомления</div> }
            </div>

            <NavComponent />
        </div>
    );
};

export default ProfileNav;
