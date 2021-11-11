import React from "react";

import styles from "./profile-nav.module.scss";
import ProfileMatches from "./ProfileMatches";
import ProfileNotifications from "./ProfileNotifications";

const NAV_MATCHES = "matches";
const NAV_NOTIFICATIONS = "notifications";

const nav: { [id: string]: React.FC } = {
    [NAV_MATCHES]: ProfileMatches,
    [NAV_NOTIFICATIONS]: ProfileNotifications
};

const ProfileNav: React.FC<{
    nickname: string;
    localUserNickname: string;
}> = ({ nickname, localUserNickname }) => {
    const [navComponent, setNavComponent] = React.useState(NAV_MATCHES);

    const isLocalProfile = nickname === localUserNickname;
    const NavComponent = nav[navComponent];

    return (
        <div className={styles.nav}>
            <div className={styles.header}>
                <div onClick={() => setNavComponent(NAV_MATCHES)} >матчи</div>
                { isLocalProfile && <div onClick={() => setNavComponent(NAV_NOTIFICATIONS)}>уведомления</div> }
            </div>

            <NavComponent />
        </div>
    );
};

export default ProfileNav;
