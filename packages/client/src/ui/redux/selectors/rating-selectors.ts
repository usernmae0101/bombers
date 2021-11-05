import { AppStateType } from "../store";
import * as RatingTypes from "../types/rating-types";

export const select_users = (state: AppStateType): RatingTypes.UserRatingType[] => {
    return state.rating.users; 
};

export const select_has_more_users = (state: AppStateType): boolean => {
    return state.rating.hasMoreUsers;
};

export const select_is_fetching = (state: AppStateType): boolean => {
    return state.rating.isFetching;
};
