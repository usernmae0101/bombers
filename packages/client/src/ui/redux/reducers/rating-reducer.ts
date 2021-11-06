import * as RatingTypes from "../types/rating-types";

const initialState: RatingTypes.RatingStateType = {
    users: [],
    hasMoreUsers: true,
    isFetching: false,
    totalUsers: null
};

export default function ratingReducer(
    state = initialState,
    action: RatingTypes.RatingActionTypes
): RatingTypes.RatingStateType {
    switch (action.type) {
        case RatingTypes.ACTION_TYPE_RATING_ADD_USERS:
            return { 
                ...state, 
                users: [...state.users, ...action.payload] 
            };
        case RatingTypes.ACTION_TYPE_RATING_SET_USERS:
            return { 
                ...state, 
                users: action.payload 
            };
        case RatingTypes.ACTION_TYPE_RATING_SET_HAS_MORE_USERS:
            return { 
                ...state, 
                hasMoreUsers: action.payload 
            };
        case RatingTypes.ACTION_TYPE_RATING_SET_IS_FETCHING:
            return { 
                ...state, 
                isFetching: action.payload 
            };
        case RatingTypes.ACTION_TYPE_RATING_SET_TOTAL_USERS:
            return {
                ...state,
                totalUsers: action.payload
            };
        default: return state;  
    }
};
