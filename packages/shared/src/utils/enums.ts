export enum EntityNumbers {
    GRASS,
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
    FIRE_EDGE,
    FIRE_TOP,
    FIRE_BOTTOM,
    ITEM_HEALTH,
    ITEM_RADIUS,
    ITEM_BOMB,
    ITEM_SPEED,
    ARROW
}

export enum InputKeys {
    INPUT_KEY_W,
    INPUT_KEY_D,
    INPUT_KEY_S,
    INPUT_KEY_A,
    INPUT_KEY_SPACE
}

export enum SocketChannels {
    CHAT_ON_MESSAGE,
    CHAT_ON_SET_STATE,
    CHAT_ON_LEAVE_MEMBER,
    CHAT_ON_JOIN_MEMBER,
    APP_ON_JOIN_CHAT,
    APP_ON_LEAVE_CHAT,
    APP_ON_JOIN_GAME,
    APP_ON_LEAVE_GAME,
    APP_ON_SET_ONLINE,
    BATTLE_ON_SET_INIT_DATA,
    BATTLE_ON_RUN_GAME,
    BATTLE_ON_SEND_INPUT_KEYS,
    BATTLE_ON_SEND_READY,
    BATTLE_ON_SET_START_TIMER,
    BATTLE_ON_PING,
    BATTLE_ON_PONG,
    BATTLE_ON_PLACE_BOMB,
    BATTLE_ON_UPDATE_SLOTS
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

export enum ContainterLayers {
    GRASS,
    CRATER,
    BOX,
    ROCK,
    FIRE,
    ITEM,
    BOMB,
    PLAYER
}

export enum MoveDirections {
    LEFT,
    RIGHT,
    UP,
    DOWN
}