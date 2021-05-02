export type AuthUserDataRsponseType = {
    /**  Никнейм пользователя. */
    nickname: string;
    /** Аватар пользователя. URL. */
    avatar: string;
    /** Рейтинг пользователя. */
    rating: number;
    /** Пользовательский токен. Используетя для аутентификации к веб-сокету. */
    token: string;
};
