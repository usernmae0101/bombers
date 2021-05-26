/**
 * Максимальная длина сообщения в чате.
 */
export const CHAT_MAX_MESSAGE_LENGTH = 300;

/**
 * Количество сообщений чата, которые запоминаются в истории.
 */
export const CHAT_MESSAGES_BUFFER_SIZE = 20;

/**
 * Размер игрового тайла в пикселях.
 */
export const GAME_RESOLUTION_TILE_SIZE = 72;

/**
 * Количетво игровых тайлов на карте в ширину.
 */
export const GAME_RESOLUTION_TILE_LENGTH_X = 17;

/**
 * Задерка в миллисекундах перед взрывом бомбы.
 */
export const GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT = 2500;

/**
 * Количество игровых тайлов на карте в высоту.
 */
export const GAME_RESOLUTION_TILE_LENGTH_Y = 11;

/**
 * Частота обновления игрового состояния на сервере в секунду.
 */
export const GAME_SERVER_TICK_RATE = 45;

/**
 * Частота отправки игрового состояния подключенным сокетам в секунду.
 */
 export const GAME_SERVER_BROADCAST_RATE = 10;

/**
 * Идентификатор html-элемента для канваса.
 */
export const GAME_CANVAS_VIEW_ID = "cnv";

/**
 * Частота бновления локального сотояния и отправки клавиш на сервер в секунду.
 */
export const GAME_CLIENT_UPDATE_RATE = 45;

/**
 * Абсолютный путь (от index.html) к изображению травы.
 */
export const GAME_RESOURCES_IMAGE_GRASS = "/images/grass.png";

/**
 * Абсолютный путь (от index.html) к изображению набора тайлов.
 */
export const GAME_RESOURCES_IMAGE_TILESET = "/images/tilemap_72x72.png";