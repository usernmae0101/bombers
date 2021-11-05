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
};
