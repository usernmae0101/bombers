import * as Enums from "./enums";

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

export interface IGameState {
    /** Игровая карта. */
    map: number[][][];
    /** Игроки. */
    plyaers: {
        [color: number]: IGameStatePlayer;
    }
}

export interface IGameStatePlayer {
    /** Здоровье игрока. */
    health: number;
    /** Направление движения игрока. */
    direction: Enums.MoveDirections;
    /** Скорость игрока. */
    speed: number;
    /** Радиус взрыва бомбы. */
    radius: number;
    /** Количество доступных бомб. */
    bombs: number;
    /** Позиция игрока по X на карте. */
    x: number;
    /** Позиция игрока по Y на карте. */
    y: number;
}

export interface IGameRoom {
    /** Идентификатор карты. */
    mapId: Enums.GameMaps;
    /** Открыта ли комната (можно ли занять игровой слот). */
    isLocked: boolean; 
    /** Количество занятых игровых слотов. */
    activeSlots: number;
    /** Общее количество игровых слотов. */
    totalSlots: number;
}

export interface IRoomUser {
    /** Цвет игрока пользователя. */
    color: Enums.PlayerColors;
}

export interface IRoomUsers {
    /** Подключенные к комнате пользователи. */
    [token: string]: IRoomUser;
}

export interface ILobbyServer {
    /** Порт TCP сокет-сервера. */
    TCP_port: number;
    /** Адрес сигнального HTTP-сервера и сокет-сервера. */
    address: string;
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
