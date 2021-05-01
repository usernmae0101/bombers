export interface IUser {
    /**
     * Никнейм пользователя.
     */
    nickname: string;
    /**
     * Рйтинг пользователя.
     */
    rating: number;
    /**
     * Аватар пользователя. URL.
     */
    avatar: string;
}

export interface IChatMessage {
    /**
     * Автор сообщения.
     */
    author: IUser;
    /**
     * Текст сообщения.
     */
    message: string;
}

export interface IServerAppState {
    /**
     * Количество подключенных пользователей.
     */
    online: number;
    /**
     * Сообщения в чате, сохраненные в буфере.
     */
    messages: IChatMessage[];
}