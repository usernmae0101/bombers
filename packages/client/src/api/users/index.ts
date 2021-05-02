import axios from "axios";

import { AuthUserDataRsponseType } from "./types";

/**
 * Базовый URN к API для этого модуля.
 */
const BASE_URN = "/api/users";

/**
 * Генерация HTTP-заголовков для пользователей, 
 * которые авторизованы через социальную суть.
 * 
 * @param {number} uid - идентификатор пользователя в социальной сети
 * @param {string} social - тип социальной сети: "vk" | "fb" | "ok" 
 * @returns объект с HTTP-заголовками
 */
const createSocialHeaders = (uid: number, social: string) => ({
    ["X-Uid"]: uid,
    ["X-Social"]: social
});

export const api_user_auth_social = async (uid: number, social: string): Promise<AuthUserDataRsponseType> => {
    const response = await axios.get(`${BASE_URN}/auth/social/${uid}`, {
        headers: createSocialHeaders(uid, social)
    });

    return response.data;
};

export const api_user_create_social = async (uid: number, social: string, data = {}): Promise<AuthUserDataRsponseType> => {
    const response = await axios.post(`${BASE_URN}/create/soсial`, data, {
        headers: createSocialHeaders(uid, social)
    });

    return response.data;
};