import axios from "axios";

export type ProfileDataResponseType = {
    /** Аватар пользователя. */
    avatar: string;
    /** Игровой рейтинг пользователя. */
    rating: number;
    /** Занимаемое игроком место в рейтинге. */
    place: number;
    /** ВременнАя метка создания аккаунта. */
    createdAt: number;
    /** ВременнАя метка последнего посещения. */
    lastSeen: number;
    /** Находится ли пользователь сейчас на сайте. */
    isOnline: boolean;
};

export const api_profile_fetch_data = async (
    nickname: string
): Promise<ProfileDataResponseType> => {
    const response = await axios.get(`/api/profile/${nickname}`); 

    return response.data;
};

type MatchResultResponseType = {
    /** Аватар пользователя. */
    points: number;
    /** Игровой рейтинг пользователя на момент матча. */
    rating: number;
    /** Занимаемое место игроком в матче. */
    place: number;
};

type MatchResponseType = {
    /** Результат матча. */
    result: MatchResultResponseType;
    /** Идентификатор матча. */
    id: number;
    /** Идентификатор карты. */
    map_id: number;
    /** ВременнАя метка завершения матча. */
    created_at: number;
};

export type ProfileMatchesResponseType = {
    /** Список матчей с участием пользователя. */
    matches: MatchResponseType[];
    /** Есть ли ещё матчи в базе данных. */
    hasMoreMatches: boolean;
};

export const api_profile_fetch_matches = async (
    nickname: string,
    page: number
): Promise<ProfileMatchesResponseType> => {
    const response = await axios.get(`/api/profile/${nickname}/matches/${page}`); 

    return response.data;
};

export type ProfileStatisticResponseType = {
    /** Всего сыгранных матчей. */
    totalMatches: number;
    /** Статистика по занимаемым местам. */
    placesDataset: number[];
    /** Статистика изменения рейтинга за последние 100 матчей. */
    ratingDataset: number[];
};

export const api_profile_fetch_statistic = async (
    nickname: string
): Promise<ProfileStatisticResponseType> => {
    const response = await axios.get(`/api/profile/${nickname}/statistic`);

    return response.data;
};
