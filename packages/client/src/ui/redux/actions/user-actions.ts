import { Socket } from "socket.io-client";

import * as Shared from "@bombers/shared/src/idnex";
import * as UserTypes from "../types/user-types";

export const action_user_set_data = (
    data: Shared.Interfaces.IUser
): UserTypes.UserSetDataActionType => ({
    type: UserTypes.ACTION_TYPE_USER_SET_DATA,
    payload: data
});

export const action_user_set_socket_instance = (
    socket: Socket
): UserTypes.UserSetSocketInstanceActionType => ({
    type: UserTypes.ACTION_TYPE_USER_SET_SOCKET_INSTANCE,
    payload: socket
});

export const action_user_set_auth = (
    isAuth: boolean
): UserTypes.UserSetAuthActionType => ({
    type: UserTypes.ACTION_TYPE_USER_SET_AUTH,
    payload: isAuth
});

export const action_user_fetch_data_social = (
    data: UserTypes.UserSocialDataType
): UserTypes.UserFetchDataSocialActionType => ({
    type: UserTypes.ACTION_TYPE_USER_FETCH_DATA_SOCIAL,
    payload: data
});

export const action_user_set_error_code = (
    code: number
): UserTypes.UserSetErrorCodeActionType => ({
    type: UserTypes.ACTION_TYPE_USER_SET_ERROR_CODE,
    payload: code
});

export const action_user_create_social = (
    data: UserTypes.UserSocialDataType & { data: any }
): UserTypes.UserCreateSocialActionType => ({
    type: UserTypes.ACTION_TYPE_USER_CREATE_SOCIAL,
    payload: data
});

export const action_user_set_error_message = (
    message: string
): UserTypes.UserSetErrorMessageActionType => ({
    type: UserTypes.ACTION_TYPE_USER_SET_ERROR_MESSAGE,
    payload: message
});

export const action_uesr_set_social_uid = (
    uid: number
): UserTypes.UserSetSocialUidActionType => ({
    type: UserTypes.ACTION_TYPE_USER_SET_SOCIAL_UID,
    payload: uid
});

export const action_user_set_social_type = (
    social: string
): UserTypes.UserSetSocialTypeActionType => ({
    type: UserTypes.ACTION_TYPE_USER_SET_SOCIAL_TYPE,
    payload: social
});

export const action_user_set_auth_is_social = (
    isViaSocail: boolean
): UserTypes.UserSetAuthTypeActionType => ({
    type: UserTypes.ACTION_TYPE_USER_SET_AUTH_TYPE,
    payload: isViaSocail
});

export const action_user_set_auth_token = (
    token: string
): UserTypes.UserSetAuthTokenActionType => ({
    type: UserTypes.ACTION_TYPE_USER_SET_AUTH_TOKEN,
    payload: token
});

