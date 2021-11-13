import React from "react";
import { useDispatch, useSelector } from "react-redux";

import * as ProfileSelectors from "@bombers/client/src/ui/redux/selectors/profile-selectors";
import * as ProfileActions from "@bombers/client/src/ui/redux/actions/profile-actions";

const ProfileMatches: React.FC<{
    nickname: string;
}> = ({ nickname }) => {
    const dispatch = useDispatch();

    const [pageNumber, setPageNumber] = React.useState(1);
    
    const isFetching = useSelector(ProfileSelectors.select_profile_matches_is_fetching);
    const matches = useSelector(ProfileSelectors.select_profile_matches_list);
    const hasMoreMatches = useSelector(ProfileSelectors.select_profile_matches_has_more);
    
    React.useEffect(
        () => {
            return () => {
                dispatch(
                   ProfileActions.action_profile_set_matches_has_more(true) 
                );
                dispatch(
                   ProfileActions.action_profile_set_matches_is_fetching(false) 
                );
                dispatch(
                   ProfileActions.action_profile_set_matches([]) 
                );
            };
        },
        []
    );

    React.useEffect(
        () => {
            if (hasMoreMatches && !isFetching) {
                dispatch(
                    ProfileActions.action_profile_fetch_matches(
                        {
                            nickname,
                            page: pageNumber
                        }
                    )        
                );
            } 
        },
        [pageNumber]
    );

    return (
        <div>
            { isFetching && <div>Loading...</div> }
        </div>
    );
};

export default ProfileMatches;
