import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./rating-list.module.scss";
import * as RatingSelectors from "@bombers/client/src/ui/redux/selectors/rating-selectors";
import * as RatingActions from "@bombers/client/src/ui/redux/actions/rating-actions";

type UserPropsType = {
    nickname: string;
    avatar: string;
    rating: number;
    place: number;
};

const User: React.FC<{ ref: React.Ref<any> } & UserPropsType> = React.forwardRef((props, ref) => {
    return (
        <div 
            ref={ref} 
            className={styles.user}
            data-place={props.place}
        >
            <div className={styles.place}>
                {props.place}
            </div>

            <div className={styles.avatar}>
                <img src={props.avatar} />
            </div>
            
            <div className={styles.nickname}>
                <Link to={`/profile/${props.nickname}`}>{props.nickname}</Link>
            </div>

            <div className={styles.rating}>
                {props.rating}
            </div>
        </div>
   ); 
});

const RatingList = () => {
    const dispatch = useDispatch();

    const [pageNumber, setPageNumber] = React.useState(1);

    const isFetching = useSelector(RatingSelectors.select_is_fetching);
    const users = useSelector(RatingSelectors.select_users);
    const hasMoreUsers = useSelector(RatingSelectors.select_has_more_users);

    React.useEffect(
        () => {
            return () => {
                dispatch(
                    RatingActions.action_rating_set_has_more_users(true)
                );
                dispatch(
                    RatingActions.action_rating_set_is_fetching(false)
                );
                dispatch(
                    RatingActions.action_rating_set_users([])
                );
            };
        },
        []
    );

    React.useEffect(
        () => {
            if (hasMoreUsers && !isFetching) {
                dispatch(
                    RatingActions.action_rating_fetch_users(pageNumber)
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
                if (entries[0].isIntersecting && hasMoreUsers) {
                    setPageNumber(prevPageNumber => prevPageNumber + 1)
                }
            });
            node && observer.current.observe(node)
        },
        [isFetching, hasMoreUsers]
    );

    return (
        <div className={styles.list}>
            {
                users.map((user, index) => {
                    return (
                        <User 
                            ref={users.length === index + 1 ? lastUserElementRef : null}
                            key={user.nickname} 
                            { ...{...user, place: index + 1} } 
                        />
                    );
                })
            }
            
            { isFetching && <div>Loading...</div> }
        </div>
    );
};

export default RatingList;
