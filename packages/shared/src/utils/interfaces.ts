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
    /**
     * Время, когда сообщение было отправлено. Unix-время.
     */
    date: number;
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

export interface IGameSlot {
    /**
     * Данные игрока.
     */
    user: IUser,
    /**
     * Статус подключения к игровому северу.
     */
    isDisconnected: boolean;
    /**
     * Статус готовности к игре.
     */
    isReady: boolean;
}

export interface IGameSlots {
    /**
     * Игровой слот. Ключ - цвет.
     */
    [color: number]: IGameSlot;
}