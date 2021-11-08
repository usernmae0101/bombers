import React from "react";
import { useSelector } from "react-redux";

import Navbar from "../../components/Navbar";
import styles from "./profile-page.module.scss";
import { RoutesPropsType } from "../../Routes";
import Loader from "../../components/Loader";
import ProfileBoard from "../../components/Profile/ProfileBoard";
import ProfileNav from "../../components/Profile/ProfileNav";

const ProfilePage: React.FC<RoutesPropsType> = ({ match }) => {
    const { nickname } = match.params;

    return (
        <div className={styles.page}>
            <Navbar />
            <ProfileBoard {...{ nickname }} />
            <ProfileNav {...{ nickname }} />
        </div>
    );
};

export default ProfilePage;
