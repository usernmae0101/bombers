import axios from "axios";

import { FetchRatingUsersReposnseType } from "./types";

export const api_rating_fetch_users = async (
    page: number
): Promise<FetchRatingUsersReposnseType> => {
    const response = await axios.get(`/api/rating/${page}`);

    return response.data;
};
