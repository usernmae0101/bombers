import * as Shared from "@bombers/shared/src/idnex";

/**
 * Создаёт игровое состояние.
 * 
 * @param map - игровая карта
 * @returns игровое состояние
 */
export const createState = (map: number[][][]): Shared.Interfaces.IGameState => ({
    map,
    plyaers: {}
});

/**
 * Создаёт нового игрока для игрового состояния.
 * 
 * @param x - начальная позиция по X
 * @param y - начальная позиция по Y
 * @returns игрок
 */
export const createPlayer = (x: number, y: number): Shared.Interfaces.IGameStatePlayer => ({
    health: 3,
    bombs: 1,
    speed: 1,
    radius: 1,
    direction: Shared.Enums.MoveDirections.DOWN,
    x,
    y
});