import * as ProfileTypes from "../types/profile-types";

const initialState: ProfileTypes.ProfileStateType = {
    avatar: null,
    rating: null,
    place: null,
    isReady: false,
    notifications: {
        isFetching: false,
        hasMore: true,
        list: []
    },
    matches: {
        isFetching: false,
        hasMore: true,
        list: []
    }
};

export default function profileReducer(
    state = initialState,
    action: ProfileTypes.ProfileActionsType
): ProfileTypes.ProfileStateType {
    switch (action.type) {
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_AVATAR:
            return { ...state, avatar: action.payload };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_PLACE:
            return { ...state, place: action.payload };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_RATING:
            return { ...state, rating: action.payload };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_READY:
            return { ...state, isReady: action.payload };
        default: return state;
    }
};
