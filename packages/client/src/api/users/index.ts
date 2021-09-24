import axios from "axios";

import { AuthUserDataRsponseType } from "./types";

/**
 * Генерация HTTP-заголовков для пользователей, 
 * которые авторизованы через социальную суть.
 * 
 * @param uid - идентификатор пользователя в социальной сети
 * @param social - тип социальной сети: "vk" | "fb" | "ok" 
 * @returns объект с HTTP-заголовками
 */
const createSocialHeaders = (uid: number, social: string) => ({
    ["X-Uid"]: uid,
    ["X-Social"]: social,
    ["X-Query"]: (window.location.search).slice(1)
});

export const api_user_auth_social = async (
    uid: number, 
    social: string
): Promise<AuthUserDataRsponseType> => {
    const response = await axios.get(`/api/social/users/auth/`, {
        headers: createSocialHeaders(uid, social)
    });

    return response.data;
};

export const api_user_create_social = async (
    uid: number, 
    social: string, 
    data = {}
): Promise<AuthUserDataRsponseType> => {
    const response = await axios.post(`/api/social/users/create/`, data, {
        headers: createSocialHeaders(uid, social)
    });

    return response.data;
};
