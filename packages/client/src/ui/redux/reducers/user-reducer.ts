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
    actions: UserTypes.UserActionsType
): UserTypes.UserStateType {
    switch (actions.type) {
        case UserTypes.ACTION_TYPE_USER_SET_AUTH_TYPE:
            return {
                ...state, auth: { ...state.auth, isAuthViaSocial: actions.payload }
            };
        case UserTypes.ACTION_TYPE_USER_SET_AUTH_TOKEN:
            return {
                ...state, auth: { ...state.auth, token: actions.payload }
            };
        case UserTypes.ACTION_TYPE_USER_SET_SOCIAL_UID:
            return { ...state, social: { ...state.social, uid: actions.payload } };
        case UserTypes.ACTION_TYPE_USER_SET_SOCIAL_TYPE:
            return { ...state, social: { ...state.social, social: actions.payload } };
        case UserTypes.ACTION_TYPE_USER_SET_DATA:
            return { ...state, data: actions.payload };
        case UserTypes.ACTION_TYPE_USER_SET_AUTH:
            return { ...state, isAuth: actions.payload };
        case UserTypes.ACTION_TYPE_USER_SET_ERROR_MESSAGE:
            return { ...state, error: { ...state.error, message: actions.payload } }
        case UserTypes.ACTION_TYPE_USER_SET_ERROR_CODE:
            return { ...state, error: { ...state.error, code: actions.payload } };
        case UserTypes.ACTION_TYPE_USER_SET_SOCKET_INSTANCE:
            return { ...state, socket: { ...state.socket, isnstance: actions.payload } };
        default: return state;
    }
}
