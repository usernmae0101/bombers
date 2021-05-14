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
     * Получение состояния игровой комнаты на сервере.
     */
    GAME_ON_SET_ROOM_STATE,
    /**
     * Обновление количества подключенных пользователей.
     */
    APP_ON_SET_ONLINE,
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
    MAP_1
}