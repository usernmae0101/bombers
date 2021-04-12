import {Client, Room} from "colyseus.js";
import {
    ACTION_TYPE_USER_FETCH_DATA_SOCIAL,
    ACTION_TYPE_USER_SET_AUTH,
    ACTION_TYPE_USER_SET_DATA,
    ACTION_TYPE_USER_SET_ERROR_CODE,
    ACTION_TYPE_USER_SET_SOCKET_APP_ROOM,
    ACTION_TYPE_USER_SET_SOCKET_INSTANCE,
    UserFetchDataSocialActionType,
    UserSocialDataType,
    UserSetAuthActionType,
    UserSetDataActionType,
    UserSetErrorCodeActionType,
    UserSetSocetAppRoomActionType,
    UserSetSocketInstanceActionType,
    UserStateDataType,
    UserCreateSocialActionType,
    ACTION_TYPE_USER_CREATE_SOCIAL,
    UserSetErrorMessageActionType,
    ACTION_TYPE_USER_SET_ERROR_MESSAGE,
    UserSetSocialUidActionType,
    ACTION_TYPE_USER_SET_SOCIAL_UID,
    UserSetSocialTypeActionType,
    ACTION_TYPE_USER_SET_SOCIAL_TYPE,
    UserSetAuthTypeActionType,
    ACTION_TYPE_USER_SET_AUTH_TYPE,
    UserSetAuthTokenActionType,
    ACTION_TYPE_USER_SET_AUTH_TOKEN,
    ACTION_TYPE_USER_SET_SOCKET_BATTLE_ROOM,
    UserSetSocetBattleRoomActionType
} from "../types/user-types";

export const action_user_set_data = (data: UserStateDataType): UserSetDataActionType => ({
    type: ACTION_TYPE_USER_SET_DATA,
    payload: data
});

export const action_user_set_socket_instance = (socket: Client): UserSetSocketInstanceActionType => ({
    type: ACTION_TYPE_USER_SET_SOCKET_INSTANCE,
    payload: socket
});

export const action_user_set_socket_app_room = (room: Room): UserSetSocetAppRoomActionType => ({
    type: ACTION_TYPE_USER_SET_SOCKET_APP_ROOM,
    payload: room
});

export const action_user_set_socket_battle_room = (room: Room): UserSetSocetBattleRoomActionType => ({
    type: ACTION_TYPE_USER_SET_SOCKET_BATTLE_ROOM,
    payload: room
});

export const action_user_set_auth = (isAuth: boolean): UserSetAuthActionType => ({
    type: ACTION_TYPE_USER_SET_AUTH,
    payload: isAuth
});

export const action_user_fetch_data_social = (data: UserSocialDataType): UserFetchDataSocialActionType => ({
    type: ACTION_TYPE_USER_FETCH_DATA_SOCIAL,
    payload: data
});

export const action_user_set_error_code = (code: number): UserSetErrorCodeActionType => ({
    type: ACTION_TYPE_USER_SET_ERROR_CODE,
    payload: code
});

export const action_user_create_social = (data: UserSocialDataType & {data: any}): UserCreateSocialActionType => ({
    type: ACTION_TYPE_USER_CREATE_SOCIAL,
    payload: data
});

export const action_user_set_error_message = (message: string): UserSetErrorMessageActionType => ({
    type: ACTION_TYPE_USER_SET_ERROR_MESSAGE,
    payload: message
});

export const action_uesr_set_social_uid = (uid: number): UserSetSocialUidActionType => ({
    type: ACTION_TYPE_USER_SET_SOCIAL_UID,
    payload: uid
});

export const action_user_set_social_type = (social: string): UserSetSocialTypeActionType => ({
    type: ACTION_TYPE_USER_SET_SOCIAL_TYPE,
    payload: social
});

export const action_user_set_auth_is_social = (isViaSocail: boolean): UserSetAuthTypeActionType => ({
    type: ACTION_TYPE_USER_SET_AUTH_TYPE,
    payload: isViaSocail
});

export const action_user_set_auth_token = (token: string): UserSetAuthTokenActionType => ({
    type: ACTION_TYPE_USER_SET_AUTH_TOKEN,
    payload: token
});

