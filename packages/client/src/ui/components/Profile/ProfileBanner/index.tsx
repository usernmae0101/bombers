import React from "react";
import { useSelector } from "react-redux";

import styles from "./profile-banner.module.scss";
import * as ProfileSelectors from "@bombers/client/src/ui/redux/selectors/profile-selectors";

const ProfileBanner: React.FC<{
    nickname: string;
    localUserNickname: string;
}> = ({ nickname, localUserNickname }) => {
    const rating = useSelector(ProfileSelectors.select_profile_data_rating);
    const place = useSelector(ProfileSelectors.select_profile_data_place);
    const avatar = useSelector(ProfileSelectors.select_profile_data_avatar);
    const lastSeen = useSelector(ProfileSelectors.select_profile_data_last_seen);
    const createdAt = useSelector(ProfileSelectors.select_profile_data_created_at);
    const isOnline = useSelector(ProfileSelectors.select_profile_data_is_online);

    return (
        <div>
        </div>
    );
};

export default ProfileBanner;
