import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./profile-board.module.scss";
import * as ProfileActions from "@bombers/client/src/ui/redux/actions/profile-actions";
import * as ProfileSelectors from "@bombers/client/src/ui/redux/selectors/profile-selectors";

const ProfileBoard: React.FC<{
    nickname: string;
}> = ({ nickname }) => {
    const dispatch = useDispatch();

    const isReady = useSelector(ProfileSelectors.select_profile_is_ready);
    const rating = useSelector(ProfileSelectors.select_profile_rating);
    const place = useSelector(ProfileSelectors.select_profile_place);
    const avatar = useSelector(ProfileSelectors.select_profile_avatar);
    
    React.useEffect(
        () => {
            dispatch(
                ProfileActions.action_profile_fetch_data(nickname)
            );

            return () => {
                dispatch(
                    ProfileActions.action_profile_set_ready(false)
                ); 
            };
        },
        []
    );

    if (!isReady) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div>
            <div>{rating}</div>
            <div>{place}</div>
        </div>
    );
};

export default ProfileBoard;
