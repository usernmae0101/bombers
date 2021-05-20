/**
 * Идентификаторы клавиш, которые регистрируются во время игры.
 */
export enum InputKeys {
    /** 
     * "W", 
     * "ц", 
     * "w", 
     * "Ц",
     * "Стреллка вверх". 
     */
    INPUT_KEY_W,
    /** 
     * "D", 
     * "в", 
     * "d", 
     * "В",
     * "Стреллка вправо". 
     */
    INPUT_KEY_D,
    /** 
     * "S", 
     * "ы", 
     * "s", 
     * "Ы",
     * "Стреллка вниз". 
     */
    INPUT_KEY_S,
    /** 
     * "A", 
     * "ф", 
     * "a", 
     * "Ф",
     * "Стреллка влево".
     */
    INPUT_KEY_A,
    INPUT_KEY_SPACE
}

/** 
 * Идентификаторы каналов веб-сокета. 
 */
export enum SocketChannels {
    /**
     * Получение сетевой задержки между клиентом и игровым сервером.
     */
    GAME_ON_PING_PONG,
    /** 
     * Обновление состояния комнаты для подключенных к лобби. 
     */
    GAME_ON_UPDATE_LOBBY_ROOM_STATE,
    /**
     * Обновление игровых слотов комнаты.
     */
    GAME_ON_UPDATE_GAME_ROOM_SLOTS,
    /**
     * Подтверждение готовности к игре.
     */
    GAME_ON_READY_TO_PLAY,
    /**
     * Отправление данных пользователю при подключении к комнате.
     */
    GAME_ON_CONNECT_ROOM_DATA,
    /**
     * Получение состояния игровой комнаты на сервере.
     */
    GAME_ON_SET_ROOM_STATE,
    /**
     * Начало игры.
     */
    GAME_ON_START,
    /**
     * Конец игры.
     */
    GAME_ON_END,
    /**
     * Обновление количества подключенных пользователей.
     */
    APP_ON_SET_ONLINE,
    /** 
     * Аутентификация пользователя при подключении к игровой комнате. 
     */
    APP_ON_GAME_AUTH,
    /**
     * Получение части игровых серверов.
     */
    APP_ON_GET_PORTION_GAME_SERVERS,
    /**
     * Обновление количества доступных серверов.
     */
    APP_ON_SET_GAME_SERVERS_COUNT,
    /**
     * Синхронизация состояния на клиенте при первом подключении.
     */
    APP_ON_SET_STATE,
    /**
     * Добавление пользователя в список участников чата.
     */
    APP_ON_ADD_CHAT_MEMBER,
    /**
     * Удаление пользователя из списка участников чата.
     */
    APP_ON_REMOVE_CHAT_MEMBER,
    /**
     * Добавление сообщения в чат.
     */
    APP_ON_ADD_CHAT_MESSAGE
}

/**
 * Возвращаемые коды от API-сервера.
 */
export enum ApiResponseCodes {
    /** 
     * Подключенный через социальную сеть пользователь не был найден в базе банных.
     */
    USER_NOT_EXISTS_SOCIAL
}

/**
 * Цвета игроков.
 */
export enum PlayerColors {
    RED,
    PURPLE,
    BLUE,
    YELLOW
}

/**
 * Направления движения игрока.
 */
export enum MoveDirections {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

/**
 * Идентификаторы игровых карт.
 */
export enum GameMaps {
    MAP_1,
    MAP_2,
    MAP_3
}

/**
 * Идентификаторы игровых сущностей.
 */
export enum EntityNumbers {
    BOX,
    ROCK,
    PLAYER
}

/**
 * Слои отрисовки контейнеров.
 */
export enum ContainerLayers {
    BOXES,
    ROCKS,
    PLAYERS
}