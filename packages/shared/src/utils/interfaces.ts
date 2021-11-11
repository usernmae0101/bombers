import * as Enums from "./enums";

export interface IUser {
    /** Никнейм пользователя. */
    readonly nickname: string;
    /** Рйтинг пользователя. */
    readonly rating: number;
    /** Аватар пользователя. URL. */
    readonly avatar: string;
}

export interface INotReliableStateData extends Partial<IGameStatePlayer> {}

export interface IChatMessage {
    /** Автор сообщения. */
    readonly author: IUser;
    /** Текст сообщения. */
    readonly message: string;
    /** Unix-время создания сообщения. */
    readonly date: number;
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
    /** ВременнАя метка запуска стены */
    wall: number;
}

export interface IGameStatePlayers {
    [color: number]: IGameStatePlayer;
}

export interface IKeysData {
    /** Номер игрового такта. */
    tick: number;
    /** Нажатые клавиши. */
    keys: Enums.InputKeys[];
}

export interface INotReliableSnapshot {
    [color: string]: INotReliableStateData;
};

export interface INotReliableStateChanges {
    /** Полученные изменения с сервера. */
    s: INotReliableSnapshot;
    /** ВременнАя метка */
    t?: number;
}

export interface ICell {
    /** Колонка ячейки */
    col: number;
    /** Ряд ячейки */
    row: number;
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
    /** Неуязвим ли игрок. */
    isImmortal?: boolean;
    /** Эмоция игрока */
    emotion: Enums.EntityNumbers;
}

export interface IBombsState {
    [color: number]: number;
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
    color: Enums.PlayerColors;
}

export interface IRoomUsers {
    [token: string]: IRoomUser;
}

export interface IAppPlayersData {
    server: string;
}

export interface IAppPlayers {
    [token: string]: IAppPlayersData;
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
    [color: number]: IGameSlot;
}
