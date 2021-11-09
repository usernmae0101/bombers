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
    GAME_ON_EMOTION_UPDATE,
    GAME_ON_START_WALL,
    GAME_ON_PING_PONG,
    GAME_ON_UPDATE_LOBBY_ROOM_STATE,
    GAME_ON_UPDATE_GAME_ROOM_SLOTS,
    GAME_ON_LEAVVE_ROOM,
    GAME_ON_UPDATE_GAME_STATE,
    GAME_ON_SEND_INPUT_KEYS,
    GAME_ON_READY_TO_PLAY,
    GAME_ON_CONNECT_ROOM_DATA,
    GAME_ON_SET_ROOM_STATE,
    GAME_ON_START,
    GAME_ON_END,
    GAME_ON_ROOM_RECONNECT,
    APP_ON_SET_ONLINE,
    APP_ON_GAME_AUTH,
    APP_ON_GET_PORTION_GAME_SERVERS,
    APP_ON_SET_GAME_SERVERS_COUNT,
    APP_ON_SET_STATE,
    APP_ON_ADD_CHAT_MEMBER,
    APP_ON_REMOVE_CHAT_MEMBER,
    APP_ON_ADD_CHAT_MESSAGE
}

export enum ApiResponseCodes {
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
    EMOTION_1_FRONT,
    EMOTION_2_FRONT,
    EMOTION_3_FRONT,
    EMOTION_4_FRONT,
    ARROW
}

export enum ContainerLayers {
    BOXES,
    CRATERS,
    ITEMS,
    ROCKS,
    FIRES,
    BOMBS,
    PLAYERS
}
