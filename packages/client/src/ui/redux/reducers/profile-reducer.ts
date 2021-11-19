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
    matches: {
        isFetching: false,
        hasMore: true,
        list: []
    },
    statistic: {
        isFetching: true,
        data: {
            totalMatches: null,
            placesDataset: [],
            ratingDataset: []
        }
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
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_MATCHES_FETCHING:
            return {
                ...state,
                matches: { ...state.matches, isFetching: action.payload }
            };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_MATCHES_HAS_MORE:
            return {
                ...state,
                matches: { ...state.matches, hasMore: action.payload }
            };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_MATCHES:
            return {
                ...state,
                matches: { ...state.matches, list: action.payload }
            };
        case ProfileTypes.ACTION_TYPE_PROFILE_ADD_MATCHES:
            return {
                ...state,
                matches: { ...state.matches, list: [...state.matches.list, ...action.payload] }
            };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_STATISTIC_FETCHING:
            return {
                ...state,
                statistic: { ...state.statistic, isFetching: action.payload }
            };
        case ProfileTypes.ACTION_TYPE_PROFILE_SET_STATISTIC:
            return {
                ...state,
                statistic: { ...state.statistic, data: { ...action.payload } }
            };
        default: return state;
    }
};
