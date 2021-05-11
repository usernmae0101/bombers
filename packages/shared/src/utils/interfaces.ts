export interface IUser {
    /** Никнейм пользователя. */
    nickname: string;
    /** Рйтинг пользователя. */
    rating: number;
    /** Аватар пользователя. URL. */
    avatar: string;
}

export interface IChatMessage {
    /** Автор сообщения. */
    author: IUser;
    /** Текст сообщения. */
    message: string;
    /**  Unix-время создания сообщения. */
    date: number;
}

export interface IServerAppChat {
    /** Сообщения в чате, сохраненные в буфере. */
    messages: IChatMessage[];
    /** Подключенные к чату пользователи. */
    members: IUser[];
}

export interface IServerAppState {
    /** Количество подключенных пользователей. */
    online: number;
    /** Состояние чата на сервере. */
    chat: IServerAppChat;
    /** Список игровых серверов */
    lobby: ILobbyServer[];
}

export interface IGameRoom {
    /** Уникальный идентификатор комнаты (в контексте игрового сервера). */
    id: string;
    /** Открыта ли комната (можно ли занять игровой слот). */
    isLocked: boolean; 
    /** Количество занятых игровых слотов. */
    activeSlots: number;
    /** Общее количество игровых слотов. */
    totalSlots: number;
}

export interface ILobbyServer {
    /** Порт сигнального HTTP-серверa. */
    port: number;
    /** Адрес сигнального HTTP-сервера. */
    address: string;
    /** Список ICE-серверов (p2p необходим TURN). */
    iceServers: any[];
}

export interface IGameSlot {
    /** Данные игрока. */
    user: IUser,
    /** Статус подключения к игровому северу. */
    isDisconnected: boolean;
    /**  Статус готовности к игре. */
    isReady: boolean;
}

export interface IGameSlots {
    /** Игровой слот. Ключ каждого слота - цвет. */
    [color: number]: IGameSlot;
}
