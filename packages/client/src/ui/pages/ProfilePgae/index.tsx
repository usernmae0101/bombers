import React from "react";

import Navbar from "../../components/Navbar";
import styles from "./profile-page.module.scss";
import { RoutesPropsType } from "../../Routes";
import ProfileContainer from "../../components/Profile/ProfileContainer";

const ProfilePage: React.FC<RoutesPropsType> = ({ match }) => {
    const { nickname } = match.params;

    return (
        <div className={styles.page}>
            <Navbar />
            <ProfileContainer {...{ nickname }} />
        </div>
    );
};

export default ProfilePage;
