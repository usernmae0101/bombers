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
     * Получение количества подключенных пользователей.
     */
    APP_ON_SET_ONLINE
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