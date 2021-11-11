import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./profile-container.module.scss";
import * as ProfileActions from "@bombers/client/src/ui/redux/actions/profile-actions";
import * as ProfileSelectors from "@bombers/client/src/ui/redux/selectors/profile-selectors";
import * as UserSelectors from "@bombers/client/src/ui/redux/selectors/user-selecrots";
import ProfileBanner from "./../ProfileBanner/";
import ProfileNav from "./../ProfileNav/";

const ProfileContainer: React.FC<{
    nickname: string;
}> = ({ nickname }) => {
    const dispatch = useDispatch();
    
    const isFetching = useSelector(ProfileSelectors.select_profile_data_is_fetching);
    const localUserNickname = useSelector(UserSelectors.select_user_data_nickname);

    React.useEffect(
        () => {
            dispatch(
                ProfileActions.action_profile_fetch_data(nickname)
            );

            return () => {
                dispatch(
                    ProfileActions.action_profile_set_data_fetching(true)
                ); 
            };
        },
        []
    );

    if (isFetching) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div className={styles.container}>
            <ProfileBanner {...{ nickname, localUserNickname }} />
            <ProfileNav {...{ nickname, localUserNickname }} />
        </div>
    );
};

export default ProfileContainer;
