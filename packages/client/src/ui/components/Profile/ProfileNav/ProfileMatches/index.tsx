import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./profile-matches.module.scss";
import * as Shared from "@bombers/shared/src/idnex";
import * as ProfileSelectors from "@bombers/client/src/ui/redux/selectors/profile-selectors";
import * as ProfileActions from "@bombers/client/src/ui/redux/actions/profile-actions";

type MatchPropsType = {
    map_id: number;
    created_at: number;
    result: {
        place: number;
        points: number;
    };
};

const Match: React.FC<{ ref: React.Ref<any> } & MatchPropsType> = React.forwardRef((props, ref) => {
    return (
        <div
            className={styles.match}
            ref={ref}
        >
            <div className={styles.map}>
                <img src={String(props.map_id)} />
            </div>

            <div className={styles.place}>
                {props.result.place} место
            </div>
            
            <div className={styles.points}>
                {props.result.place === 1 ? "Победа +" : "Поражение "}{props.result.points}
            </div>

            <div className={styles.finish}>
                {Shared.Helpers.parseDateFromTimestamp(props.created_at)}
            </div>
        </div>
    );
});

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
    
    const observer: any = React.useRef();
    const lastUserElementRef = React.useCallback(
        (node) => {
            if (isFetching)
                return;
            
            observer.current?.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMoreMatches) {
                    setPageNumber(prevPageNumber => prevPageNumber + 1)
                }
            });
            node && observer.current.observe(node);
        },
        [isFetching, hasMoreMatches]
    );

    return (
        <div className={styles.list}>
            {
                matches.map((match, index) => {
                    return (
                        <Match 
                            key={match.id}
                            ref={matches.length === index + 1 ? lastUserElementRef : null}
                            {...match}
                        />
                    );
                })
            }

            { isFetching && <div>Loading...</div> }
            
            { !hasMoreMatches && !matches.length && <div>матчей нет</div> }
        </div>
    );
};

export default ProfileMatches;
