import {Client, Room} from "colyseus.js";

import {AppStateType} from "../store";
import {UserStateDataType} from "../types/user-types";

export const select_user_data_all = (state: AppStateType): UserStateDataType => {
    return state.user.data;
};

export const select_user_socket_instance = (state: AppStateType): Client => {
    return state.user.socket.isnstance;
};

export const select_user_socket_room_app = (state: AppStateType): Room => {
    return state.user.socket.rooms.app;
};

export const select_user_socket_room_battle = (state: AppStateType): Room => {
    return state.user.socket.rooms.battle;
};

export const select_user_data_nickname = (state: AppStateType): string => {
    return state.user.data.nickname;
};

export const select_user_data_rating = (state: AppStateType): number => {
    return state.user.data.rating;
};

export const select_user_data_avatar = (state: AppStateType): string => {
    return state.user.data.avatar;
};

export const select_user_auth = (state: AppStateType): boolean => {
    return state.user.isAuth;
};

export const select_user_error_code = (state: AppStateType): number => {
    return state.user.error.code;
};

export const select_user_error_message = (state: AppStateType): string => {
    return state.user.error.message;
};

export const select_user_social_uid = (state: AppStateType): number => {
    return state.user.social.uid;
};

export const select_user_social_type = (state: AppStateType): string => {
    return state.user.social.social
};

export const select_user_auth_is_social = (state: AppStateType): boolean => {
    return state.user.auth.isAuthViaSocial;
};

export const select_user_auth_token = (state: AppStateType): string => {
    return state.user.auth.token;
};
