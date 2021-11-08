import axios from "axios";

export type ProfileDataResponseType = {
    /** Аватар пользователя. */
    avatar: string;
    /** Игровой рейтинг пользователя. */
    rating: number;
    /** Занимаемое игроком место в рейтинге. */
    place: number;
};

export const api_profile_fetch_data = async (
    nickname: string
): Promise<ProfileDataResponseType> => {
    const response = await axios.get(`/api/profile/${nickname}`); 

    return response.data;
};
