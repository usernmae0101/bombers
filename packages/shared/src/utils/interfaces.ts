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

export interface IOverlapData {
    /** Ряд клетки на карте. */
    row: number;
    /** Колонка клетки на карте. */
    col: number;
    /** Дистанцая, на которую спрайт игрока перекрыл клетку. */
    distance: number;
}

export interface IRoomAuthResponseData {
    /** Статус аутентификации: успешна или нет. */
    success?: boolean;
    /** Идентификатор подключенного сокета на игровом сервере. */
    socketId: string;
    /** Авторизационный токен пользователя. */
    token?: string;
    /** Данные пользователя. */
    userData?: IUser;
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
    players: IGameStatePlayers;
}

export interface IGameStatePlayers {
    /** Игроки. Ключ игрока - цвет. */
    [color: number]: IGameStatePlayer;
}

export interface IKeysData {
    /** Номер игрового такта. */
    tick: number;
    /** Нажатые клавиши. */
    keys: Enums.InputKeys[];
}

export interface INotReliableStateData {
    /** Позиция игрока по X на карте. */
    x?: number;
    /** Позиция игрока по Y на карте. */
    y?: number;
    /** Номер игрового такта. */
    tick?: number;
    /** Направление движения игрока. */
    direction?: number;
}

export interface INotReliableStateChanges {
    [color: string]: INotReliableStateData;
}

export interface IStateChanges {
    /** Надёжные изменения, передаются на TCP. */
    reliable: any[];
    /** Ненадёжные изменения, передаются по UDP. */
    notReliable: INotReliableStateChanges;
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
    /** Номер игрового такта. */
    tick?: number;
}

export interface IStateLobbyGameRoom {
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
    /** Данные пользователя. */
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
