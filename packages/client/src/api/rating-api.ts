import axios from "axios";

type RatingUserResponseType = {
    /** Аватар пользователя. */
    avatar: string;
    /** Никнейм пользователя. */
    nickname: string;
    /** Игровой рейтинг пользователя. */
    rating: number;
};

export type FetchRatingUsersReposnseType = {
    /** Список пользователей. */
    users: RatingUserResponseType[]; 
    /** Имеются ли в базе данных ещё пользователи. */
    hasMoreUsers: boolean;
    /** Всего пользователей в базе данных */
    totalUsers: number;
};

export const api_rating_fetch_users = async (
    page: number
): Promise<FetchRatingUsersReposnseType> => {
    const response = await axios.get(`/api/rating/${page}`);

    return response.data;
};
