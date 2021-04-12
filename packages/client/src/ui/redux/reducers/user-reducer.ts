import { Client } from "colyseus.js";
import {
    ACTION_TYPE_USER_SET_AUTH,
    ACTION_TYPE_USER_SET_AUTH_TOKEN,
    ACTION_TYPE_USER_SET_AUTH_TYPE,
    ACTION_TYPE_USER_SET_DATA,
    ACTION_TYPE_USER_SET_ERROR_CODE,
    ACTION_TYPE_USER_SET_ERROR_MESSAGE,
    ACTION_TYPE_USER_SET_SOCIAL_TYPE,
    ACTION_TYPE_USER_SET_SOCIAL_UID,
    ACTION_TYPE_USER_SET_SOCKET_APP_ROOM,
    ACTION_TYPE_USER_SET_SOCKET_BATTLE_ROOM,
    ACTION_TYPE_USER_SET_SOCKET_INSTANCE,
    UserActionsType,
    UserStateType
} from "../types/user-types";

const endpoint = isDevMode ? "ws://localhost:3000" :
    location.protocol.replace("http", "ws") + "//" +
    window.document.location.host.replace(/:.*/, "") +
    (location.port ? ":" + location.port : "");

const initialState: UserStateType = {
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
        isnstance: new Client(endpoint),
        rooms: {
            app: null,
            battle: null
        }
    },
    data: {
        nickname: null,
        rating: null,
        avatar: null
    }
};

export default function userReducer(state = initialState, actions: UserActionsType): UserStateType {
    switch (actions.type) {
        case ACTION_TYPE_USER_SET_AUTH_TYPE:
            return {
                ...state, auth: { ...state.auth, isAuthViaSocial: actions.payload }
            };
        case ACTION_TYPE_USER_SET_AUTH_TOKEN:
            return {
                ...state, auth: { ...state.auth, token: actions.payload }
            };
        case ACTION_TYPE_USER_SET_SOCIAL_UID:
            return { ...state, social: { ...state.social, uid: actions.payload } };
        case ACTION_TYPE_USER_SET_SOCIAL_TYPE:
            return { ...state, social: { ...state.social, social: actions.payload } };
        case ACTION_TYPE_USER_SET_DATA:
            return { ...state, data: actions.payload };
        case ACTION_TYPE_USER_SET_AUTH:
            return { ...state, isAuth: actions.payload };
        case ACTION_TYPE_USER_SET_SOCKET_APP_ROOM:
            return {
                ...state, socket: {
                    ...state.socket, rooms: {
                        ...state.socket.rooms, app: actions.payload
                    }
                }
            };
        case ACTION_TYPE_USER_SET_SOCKET_BATTLE_ROOM:
            return {
                ...state, socket: {
                    ...state.socket, rooms: {
                        ...state.socket.rooms, battle: actions.payload
                    }
                }
            };
        case ACTION_TYPE_USER_SET_ERROR_MESSAGE:
            return { ...state, error: { ...state.error, message: actions.payload } }
        case ACTION_TYPE_USER_SET_ERROR_CODE:
            return { ...state, error: { ...state.error, code: actions.payload } };
        case ACTION_TYPE_USER_SET_SOCKET_INSTANCE:
            return { ...state, socket: { ...state.socket, isnstance: actions.payload } };
        default: return state;
    }
}
