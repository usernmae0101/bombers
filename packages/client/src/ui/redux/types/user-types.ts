import { AppState, GameState } from "@bombers/shared/src/idnex";
import {Client, Room} from "colyseus.js";

export const ACTION_TYPE_USER_CREATE_SOCIAL = "USER/CREATE_SOCIAL";
export const ACTION_TYPE_USER_SET_DATA = "USER/SET_DATA";
export const ACTION_TYPE_USER_SET_AUTH_TOKEN = "USER/SET_AUTH_TOKEN";
export const ACTION_TYPE_USER_SET_AUTH_TYPE = "USER/SET_AUTH_TYPE";
export const ACTION_TYPE_USER_SET_ERROR_CODE = "USER/SET_ERROR_CODE";
export const ACTION_TYPE_USER_SET_SOCIAL_TYPE = "USER/SET_SOCIAL_TYPE";
export const ACTION_TYPE_USER_SET_SOCIAL_UID = "USER/SET_SOCIAL_UID";
export const ACTION_TYPE_USER_SET_ERROR_MESSAGE = "USER/SET_ERROR_MESSAGE";
export const ACTION_TYPE_USER_FETCH_DATA_SOCIAL = "USER/FETCH_DATA_SOCIAL";
export const ACTION_TYPE_USER_SET_AUTH = "USER/SET_AUTH";
export const ACTION_TYPE_USER_SET_SOCKET_INSTANCE = "USER/SET_SOCKET_INSTANCE";
export const ACTION_TYPE_USER_SET_SOCKET_APP_ROOM = "USER/SET_SOCKET_APP_ROOM";
export const ACTION_TYPE_USER_SET_SOCKET_BATTLE_ROOM = "USER/SET_SOCKET_BATTLE_ROOM";

export type UserStateDataType = {
    nickname: string;
    avatar: string;
    rating: number;
};

export type UserSocialDataType = {
    uid: number;
    social: string;
};

export type UserAuthType = {
    isAuthViaSocial: boolean;
    token: string;
};

export type UserErrorType = {
    message: string;
    code: number;
}

export type UserStateType = {
    isAuth: boolean;
    auth: UserAuthType;
    error: UserErrorType;
    social: UserSocialDataType;
    socket: {
        isnstance: Client | null;
        rooms: {
            app: Room<AppState> | null;
            battle: Room<GameState> | null;
        }
    };
    data: UserStateDataType;
};

export type UserSetDataActionType = {
    type: typeof ACTION_TYPE_USER_SET_DATA;
    payload: UserStateDataType;
};

export type UserSetSocketInstanceActionType = {
    type: typeof ACTION_TYPE_USER_SET_SOCKET_INSTANCE;
    payload: Client;
};

export type UserSetSocetAppRoomActionType = {
    type: typeof ACTION_TYPE_USER_SET_SOCKET_APP_ROOM;
    payload: Room;
};

export type UserSetSocetBattleRoomActionType = {
    type: typeof ACTION_TYPE_USER_SET_SOCKET_BATTLE_ROOM;
    payload: Room;
};

export type UserSetAuthActionType = {
    type: typeof ACTION_TYPE_USER_SET_AUTH;
    payload: boolean;
};

export type UserFetchDataSocialActionType = {
    type: typeof ACTION_TYPE_USER_FETCH_DATA_SOCIAL;
    payload: UserSocialDataType;
};

export type UserSetErrorCodeActionType = {
    type: typeof ACTION_TYPE_USER_SET_ERROR_CODE;
    payload: number;
};

export type UserCreateSocialActionType = {
    type: typeof ACTION_TYPE_USER_CREATE_SOCIAL;
    payload: UserSocialDataType & {
        data: any;
    };
};

export type UserSetErrorMessageActionType = {
    type: typeof ACTION_TYPE_USER_SET_ERROR_MESSAGE;
    payload: string;
};

export type UserSetSocialTypeActionType = {
    type: typeof ACTION_TYPE_USER_SET_SOCIAL_TYPE;
    payload: string;
};

export type UserSetSocialUidActionType = {
    type: typeof ACTION_TYPE_USER_SET_SOCIAL_UID;
    payload: number;
};

export type UserSetAuthTokenActionType = {
    type: typeof ACTION_TYPE_USER_SET_AUTH_TOKEN;
    payload: string;
};

export type UserSetAuthTypeActionType = {
    type: typeof ACTION_TYPE_USER_SET_AUTH_TYPE,
    payload: boolean;
};

export type UserActionsType = UserSetSocialUidActionType | UserSetSocialTypeActionType | UserSetErrorCodeActionType
    | UserSetAuthActionType | UserSetDataActionType | UserSetAuthTokenActionType | UserSetAuthTypeActionType |
    UserSetSocetBattleRoomActionType | UserSetSocketInstanceActionType | UserSetSocetAppRoomActionType | UserSetErrorMessageActionType;
