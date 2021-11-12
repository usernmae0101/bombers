import * as Shared from "./../idnex";
import { getRandomBetween } from "./maths";

const { PlayerColors, EntityNumbers } = Shared.Enums;

/**
 * Определяет в какой ячейке на карте находится игрок.
 */
export const calculatePlayerCellPosition = (
    player: Shared.Interfaces.IGameStatePlayer
): [number, number] => {
    const { GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

    return [
        Math.floor(
            (player.y + (GAME_RESOLUTION_TILE_SIZE / 2)) / GAME_RESOLUTION_TILE_SIZE
        ),
        Math.floor(
            (player.x + (GAME_RESOLUTION_TILE_SIZE / 2)) / GAME_RESOLUTION_TILE_SIZE
        )
    ];
};

/**
 * Определяет склониение количественных числительных.
 */
export const declension = (
    number: number, 
    titles: string[]
): string => {  
    const cases = [2, 0, 1, 1, 1, 2];  
    
    return titles[ 
        (number % 100 > 4 && number % 100 < 20) ? 
            2 : 
            cases[
                (number % 10 < 5) ?
                    number % 10 :
                    5
            ] 
    ];  
};

/**
 * Высчитывает количество пикселей, на которые спрайт 
 * игрока пересёк ячейку на карте.
 */
export const calculateOverlapDistance = (
    playerPoint: number, 
    cellPoint: number
): number => {
    const { GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

    return Math.abs(
        GAME_RESOLUTION_TILE_SIZE - Math.abs(playerPoint - cellPoint)
    );
};

/**
 * Перемноает количество тайлов в ширину на размер тайла в пикселях.
 */
export const calculateCanvasWidth = (): number => {
    return Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_X * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
};

/**
 * Перемножает количество тайлов в высоту на размер тайла в пикселях.
 */
export const calculateCanvasHeight = (): number => {
    return Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_Y * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
};

/**
 * Переводит unix-вермя в дату строкового формата.
 */
export const parseDateFromTimestamp = (
    timestamp: number
): string => {
    const date = new Date(timestamp);
    const now = new Date();

    const months = {
        0: "января",
        1: "февраля",
        2: "марта",
        3: "апреля",
        4: "мая",
        5: "июня",
        6: "июля",
        7: "августа",
        8: "сентября",
        9: "октября",
        10: "ноября",
        11: "декабря"
    };
    
    const hours = String(date.getHours()).padStart(2, "0");
    const minutesd = String(date.getMinutes()).padStart(2, "0");
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    const isSameDay = date.getDate() === now.getDate();
    const isSameMonth = date.getDate() === now.getDate();
    const isSameYear = date.getDate() === now.getDate();

    if (isSameDay && isSameMonth && isSameYear)
        return `сегодня в ${hours}:${minutes}`;
    else if (isSameYear)
        return `${day} ${month} в ${hours}:${minutes}`;
    else
        return `${day} ${month} ${year} в ${hours}:${minutes}`;
};

/** 
 * Переводит пройденный период, высчитанный в unix-времени, в строковый формат.
 */
export const parsePeriodFromTimestamp = (
    timestamp: number
): string => {
    const seconds = (Date.now() - timestamp) / 1000;
    const minutes = (seconds / 60) >> 0;
    const hours = (minutes / 60) >> 0;
    const days = (hours / 24) >> 0;
    const months = (days / 30) >> 0;
    const years = (months / 12) >> 0;
    
    if (years > 0)
        return `${years} ${declension(years, ["год", "года", "лет"])}`;
    else if (months > 0)
        return `${months} ${declension(months, ["месяц", "месяца", "месяцев"])}`;
    else if (days > 0)
        return `${days} ${declension(days, ["день", "дня", "дней"])}`;
    else if (hours > 0)
        return `${hours} ${declension(hours, ["час", "часа", "часов"])}`;
    else if (minutes > 0) 
        return `${minutes} ${declension(minutes, ["минуту", "минуты", "минут"])}`;
    else 
        return `${seconds} ${declension(seconds, ["секунду", "секунды", "секунд"])}`;
};

/**
 * Вычисляет ширину приложения для рендеринга.
 */
export const calculateAppAreaWidth = (): number => {
    return calculateCanvasWidth() + Shared.Constants.GAME_RESOLUTION_CANVAS_MARGIN * 2;  
};

/**
 * Вычисляет высоту приложения для рендеринга.
 */
export const calculateAppAreaHeight = (): number => {
    return calculateCanvasHeight() + Shared.Constants.GAME_RESOLUTION_CANVAS_MARGIN * 2;
};

/**
 * Создает состояние бомб для игроков, инициализируя начальным значением.
 */
export const createBombsState = (
    users: Shared.Interfaces.IRoomUsers
): Shared.Interfaces.IBombsState => {
    const bombsState: Shared.Interfaces.IBombsState = {};
    
    for (let { color } of Object.values(users))
        bombsState[color] = 1;
    
    return bombsState;
};

/**
 * Вовзращет общее количество ячеек на карте.
 */
export const getTotalMapCells = (): number => {
    return Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_X * Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_Y;
};

/**
 * Делает глубокую копию объекта: включая вложенные объекты.
 */
export const makeCopyObject = <T>(object: T): T => {
    return JSON.parse(
        JSON.stringify(object)
    );
};

/**
 * Достаёт случайный бонусный предмет из списка.
 */
export const chooseRandomBonusItem = (): Shared.Enums.EntityNumbers => {   
    const items = [
        EntityNumbers.ITEM_BOMB,
        EntityNumbers.ITEM_HEALTH,
        EntityNumbers.ITEM_RADIUS,
        EntityNumbers.ITEM_SPEED
    ];

    return items[getRandomBetween(0, items.length - 1)];
};

/**
 * Получает индентификатор бомбы по цвету игрока.
 */
export const getBombIdByPlayerColor = (color: number): Shared.Enums.EntityNumbers => {
    switch (color) {
        case PlayerColors.BLUE:
            return EntityNumbers.BOMB_BLUE;
        case PlayerColors.PURPLE:
            return EntityNumbers.BOMB_PURPLE;
        case PlayerColors.RED:
            return EntityNumbers.BOMB_RED;
        case PlayerColors.YELLOW:
            return EntityNumbers.BOMB_YELLOW;
    }
};

/**
 * Получает список идентификаторов бомб всех цветов.
 */
export const getAllBombsIds = (): Shared.Enums.EntityNumbers[] => {
    return [
        EntityNumbers.BOMB_YELLOW,
        EntityNumbers.BOMB_RED,
        EntityNumbers.BOMB_PURPLE,
        EntityNumbers.BOMB_BLUE
    ];
};

/**
 * Получает список игровых сущностей на карте в определенной ячейке.
 */
export const getAllEntitiesInCell = (
    map: number[][][], 
    row: number, 
    col: number
): number[] => {
    return [ ...map[row][col] ];
};
