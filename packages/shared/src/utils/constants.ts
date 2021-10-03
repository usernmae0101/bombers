/***************************************
 * GAMEPLAY----------------------------*
 ***************************************/


/**
 * Процент вероятности выпадения бонусного предмета из коробки.
 */
export const GAME_GAMEPLAY_DROP_ITEM_PERCENT = 65;

/**
 * Таймаут в миллисекундах на взрыв бомбы после установки.
 */
export const GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT = 3_000;

/**
 * Время в миллисекундах, после которого пламя исчезает.
 */
export const GAME_GAMEPLAY_BLAZE_TIME_TO_SHOW = 300;

/**
 * Лимит на храрактеристику игрока: бомбы.
 */
export const GAME_GAMEPLAY_PLAYER_PROPERTY_BOMBS_LIMIT = 10;

/**
 * Лимит на храрактеристику игрока: скорость.
 */
export const GAME_GAMEPLAY_PLAYER_PROPERTY_SPEED_LIMIT = 10;

/**
* Лимит на храрактеристику игрока: здоровье.
*/
export const GAME_GAMEPLAY_PLAYER_PROPERTY_HEALTH_LIMIT = 3;

/**
* Лимит на храрактеристику игрока: радиус.
*/
export const GAME_GAMEPLAY_PLAYER_PROPERTY_RADIUS_LIMIT = 10;

/**
 * На сколько миллисекунд делать игрока неязвимым после получения урона.
 */
export const GAME_GAMEPLAY_PLAYER_IMMORTAL_INTERVAL = 1_300;


/***************************************
 * RESOLUTION--------------------------*
 ***************************************/


/**
 * Размер игрового тайла в пикселях.
 */
export const GAME_RESOLUTION_TILE_SIZE = 72;

/**
 * Количетво игровых тайлов на карте в ширину.
 */
export const GAME_RESOLUTION_TILE_LENGTH_X = 17;

/**
 * Отступ при отрисовке спрайта в пикселях.
 */
export const GAME_RESOLUTION_TILE_OFFSET = 4;

/**
 * Количество игровых тайлов на карте в высоту.
 */
export const GAME_RESOLUTION_TILE_LENGTH_Y = 11;


/***************************************
 * CHAT--------------------------------*
 ***************************************/


/**
 * Максимальная длина сообщения в чате.
 */
export const CHAT_MAX_MESSAGE_LENGTH = 300;

/**
 * Количество сообщений чата, которые запоминаются в истории.
 */
export const CHAT_MESSAGES_BUFFER_SIZE = 20;


/***************************************
 * REST--------------------------------*
 ***************************************/


/**
 * Частота обновления игрового состояния на сервере в секунду.
 * 
 * @deprecated
 */
export const GAME_SERVER_TICK_RATE = 50;

/**
 * Частота отправки игрового состояния подключенным сокетам в секунду.
 */
export const GAME_SERVER_BROADCAST_RATE = 40;

/**
 * Идентификатор html-элемента для канваса с игрой.
 */
export const GAME_CANVAS_VIEW_ID = "game-cnv";

/** 
 * Фиксированное значение времени в миллисекундах на обновление игрового состояния за кадр.
 */
export const GAME_FIXED_DELTA_TIME = 20;

/**
 * Максимальная допустимая задержка в миллисекундах между кадрами.
 */
export const GAME_MAXIMUM_DELTA_TIME = 250;


/***************************************
 * RESOURCES---------------------------*
 ***************************************/


/**
 * Путь к изображению травы.
 */
export const GAME_RESOURCES_IMAGE_GRASS = "/images/grass.png";

/**
 * Путь к изображению набора тайлов.
 */
export const GAME_RESOURCES_IMAGE_TILESET = "/images/tilemap_72x72.png";

/**
 * Путь к таблице спрайтов со взрывом.
 */
export const GAME_RESOURCES_SPRITESHEET_EXPLOSION = "/images/explosion.json";

/**
 *

/***************************************
 * DEVELOPMENT-------------------------*
 ***************************************/


/**
 * Сетевая задержка в миллисекундах.
 */
export const DEV_NETWORK_PING_SIMULATION = 100;

/**
 * Потеря пакетов на сервере в процентах.
 */
export const DEV_NETWORK_PACKAGE_LOSS_SERVER = 0;

/**
 * Потеря пакетов на клиенте в процентах.
 */
export const DEV_NETWORK_PACKAGE_LOSS_CLIENT = 0;
