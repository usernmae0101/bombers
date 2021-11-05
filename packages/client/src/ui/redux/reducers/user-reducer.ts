import * as UserTypes from "../types/user-types";

const initialState: UserTypes.UserStateType = {
    isAuth: false,
    auth: {
        isAuthViaSocial: null,
        token: null
    },
    social: {
        uid: null,
        social: null
    },
    error: {
        code: null,
        message: null
    },
    socket: {
        isnstance: null,
    },
    data: {
        nickname: null,
        rating: null,
        avatar: null
    }
};

export default function userReducer(
    state = initialState,
    action: UserTypes.UserActionsType
): UserTypes.UserStateType {
    switch (action.type) {
        case UserTypes.ACTION_TYPE_USER_SET_DATA_RATING:
            return { 
                ...state, data: { ...state.data, rating: action.payload } 
            };
        case UserTypes.ACTION_TYPE_USER_SET_AUTH_TYPE:
            return { 
                ...state, auth: { ...state.auth, isAuthViaSocial: action.payload } 
            };
        case UserTypes.ACTION_TYPE_USER_SET_AUTH_TOKEN:
            return {
                ...state, auth: { ...state.auth, token: action.payload }
            };
        case UserTypes.ACTION_TYPE_USER_SET_SOCIAL_UID:
            return { 
                ...state, social: { ...state.social, uid: action.payload } 
            };
        case UserTypes.ACTION_TYPE_USER_SET_SOCIAL_TYPE:
            return { ...state, social: { ...state.social, social: action.payload } };
        case UserTypes.ACTION_TYPE_USER_SET_DATA:
            return { ...state, data: action.payload };
        case UserTypes.ACTION_TYPE_USER_SET_AUTH:
            return { ...state, isAuth: action.payload };
        case UserTypes.ACTION_TYPE_USER_SET_ERROR_MESSAGE:
            return { ...state, error: { ...state.error, message: action.payload } };
        case UserTypes.ACTION_TYPE_USER_SET_ERROR_CODE:
            return { ...state, error: { ...state.error, code: action.payload } };
        case UserTypes.ACTION_TYPE_USER_SET_SOCKET_INSTANCE:
            return { ...state, socket: { ...state.socket, isnstance: action.payload } };
        default: return state;
    }
}
