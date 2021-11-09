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
        Math.floor((player.y + (GAME_RESOLUTION_TILE_SIZE / 2)) / GAME_RESOLUTION_TILE_SIZE),
        Math.floor((player.x + (GAME_RESOLUTION_TILE_SIZE / 2)) / GAME_RESOLUTION_TILE_SIZE)
    ];
};

/**
 * Высчитывает количество пикселей, на которые 
 * спрайт игрока пересёк ячейку на карте.
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
 * Перемножет количество тайлов в ширину на размер тайла в пикселях.
 */
export const calculateCanvasWidth = (): number => {
    return Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_X * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
};

/**
 * Перемножет количество тайлов в высоту на размер тайла в пикселях.
 */
export const calculateCanvasHeight = (): number => {
    return Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_Y * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
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
