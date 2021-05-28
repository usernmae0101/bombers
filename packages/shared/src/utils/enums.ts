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
     * Обновление игрового состояния.
     */
    GAME_ON_UPDATE_GAME_STATE,
    /**
     * Отправка нажатых клавиш на сервер.
     */
    GAME_ON_SEND_INPUT_KEYS,
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

export enum ApiResponseCodes {
    /** 
     * Подключенный через социальную сеть пользователь не был найден в базе банных.
     */
    USER_NOT_EXISTS_SOCIAL
}

export enum PlayerColors {
    RED,
    PURPLE,
    BLUE,
    YELLOW
}

export enum MoveDirections {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export enum GameMaps {
    MAP_1,
    MAP_2,
    MAP_3
}

export enum EntityNumbers {
    CRATER,
    PLAYER,
    BOX,
    ROCK,
    BOMB_RED,
    BOMB_BLUE,
    BOMB_YELLOW,
    BOMB_PURPLE,
    FIRE_CENTER,
    FIRE_LEFT,
    FIRE_RIGHT,
    FIRE_MIDDLE_Y,
    FIRE_MIDDLE_X,
    FIRE_TOP,
    FIRE_BOTTOM,
    FIRE_EDGE,
    ITEM_HEALTH,
    ITEM_RADIUS,
    ITEM_BOMB,
    ITEM_SPEED,
    ARROW
}

export enum ContainerLayers {
    BOXES,
    ROCKS,
    CRATERS,
    BOMBS,
    ITEMS,
    FIRES,
    PLAYERS
}
