import axios from "axios";

import { AuthUserDataRsponseType } from "./types";

const BASE_URL = "/api/users";

const createSocialHeaders = (uid: number, social: string) => ({
    ["X-Uid"]: uid,
    ["X-Social"]: social
});

export const api_user_auth_social = async (uid: number, social: string): Promise<AuthUserDataRsponseType> => {
    const response = await axios.get(`${BASE_URL}/auth/social/${uid}`, {
        headers: createSocialHeaders(uid, social)
    });

    return response.data;
};

export const api_user_create_social = async (uid: number, social: string, data = {}): Promise<AuthUserDataRsponseType> => {
    const response = await axios.post(BASE_URL, data, {
        headers: createSocialHeaders(uid, social)
    });

    return response.data;
};