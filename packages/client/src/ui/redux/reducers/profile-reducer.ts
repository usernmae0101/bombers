import * as ProfileTypes from "../types/profile-types";

const initialState: ProfileTypes.ProfileStateType = {
    data: {
        avatar: null,
        rating: null,
        place: null,
        isFetching: true,
        lastSeen: null,
        isOnline: false,
        createdAt: null
    },
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
            return { 
                ...state, 
                data: { ...state.data, avatar: action.payload }
            };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_PLACE:
            return { 
                ...state, 
                data: { ...state.data, place: action.payload } 
            };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_RATING:
            return { 
                ...state, 
                data: { ...state.data, rating: action.payload }
            };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_DATA_FETCHING:
            return { 
                ...state, 
                data: { ...state.data, isFetching: action.payload } 
            };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_ONLINE:
            return {
                ...state,
                data: { ...state.data, isOnline: action.payload }
            };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_LAST_SEEN:
            return {
                ...state,
                data: { ...state.data, lastSeen: action.payload }
            };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_CREATED_AT:
            return {
                ...state,
                data: { ...state.data, createdAt: action.payload }
            };
        default: return state;
    }
};
