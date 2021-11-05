import * as RatingTypes from "../types/rating-types";

export const action_rating_add_users = (
    users: RatingTypes.UserRatingType[]
): RatingTypes.AddUsersActionType => ({
    type: RatingTypes.ACTION_TYPE_RATING_ADD_USERS,
    payload: users
});

export const action_rating_set_has_more_users = (
    hasMoreUsers: boolean
): RatingTypes.SetHasMoreUsersActionType => ({
    type: RatingTypes.ACTION_TYPE_RATING_SET_HAS_MORE_USERS,
    payload: hasMoreUsers
});

export const action_rating_set_is_fetching = (
    isFetching: boolean
): RatingTypes.SetIsFetchingActionType => ({
    type: RatingTypes.ACTION_TYPE_RATING_SET_IS_FETCHING,
    payload: isFetching
});

export const action_rating_set_users = (
    users: RatingTypes.UserRatingType[]
): RatingTypes.SetUsersActionType => ({
    type: RatingTypes.ACTION_TYPE_RATING_SET_USERS,
    payload: users
});

export const action_rating_fetch_users = (
    page: number
): RatingTypes.FetchUsersActionType => ({
    type: RatingTypes.ACTION_TYPE_RATING_FETCH_USERS,
    payload: page
});
