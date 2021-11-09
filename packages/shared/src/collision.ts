import * as Shared from "@bombers/shared/src/idnex";
import { calculatePlayerCellPosition, calculateOverlapDistance } from "./utils/helpers";

const { EntityNumbers } = Shared.Enums;

export function isOutOfBorder(
    player: Shared.Interfaces.IGameStatePlayer
): boolean {
    const { GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

    if (
        player.x < 0 ||
        player.x + GAME_RESOLUTION_TILE_SIZE > Shared.Helpers.calculateCanvasWidth() ||
        player.y + GAME_RESOLUTION_TILE_SIZE > Shared.Helpers.calculateCanvasHeight() ||
        player.y < 0
    ) return true;

    return false;
};

/**
 * Проверяет, находится ли в ячейке идентификатор игровой сущности
 * с которой игрок сталкивается. Если игрок хоть чуть-чуть находится 
 * на бомбе, игнорирует столкновение, позволяя "скользить".
 */
export const isPlayerCollide = (
    map: number[][][],
    overlapData: Shared.Interfaces.IOverlapData,
    speed: number
): boolean => {
    const { row, col, distance } = overlapData;
    const cellEntities = map[row][col];

    for (let entityId of cellEntities) {
        if (
            [
                EntityNumbers.BOMB_BLUE,
                EntityNumbers.BOMB_PURPLE,
                EntityNumbers.BOMB_YELLOW,
                EntityNumbers.BOMB_RED,
            ].includes(entityId)
        ) {
            return (distance - speed) < 1;
        } 

        if (
            [
                EntityNumbers.BOX,
                EntityNumbers.ROCK
            ].includes(entityId)
        ) return true;
    }

    return false;
};

/**
 * Проверяет пересечение игрока с ячейкой на карте. Если ячейка не пустая, 
 * высчитывает дистанцию пересечения и расположение ячейки на карте.
 * 
 * @returns [информация о ячейке, у границы канваса ли игрок: да, нет]
 */
 export const checkPlayerOverlap = (
    player: Shared.Interfaces.IGameStatePlayer,
    map: number[][][]
): [Shared.Interfaces.IOverlapData, boolean] => {
    const { UP, LEFT, RIGHT, DOWN } = Shared.Enums.MoveDirections;
    const {
        GAME_RESOLUTION_TILE_LENGTH_X, 
        GAME_RESOLUTION_TILE_LENGTH_Y, 
        GAME_RESOLUTION_TILE_SIZE 
    } = Shared.Constants;

    const [playerRow, playerCol] = calculatePlayerCellPosition(player);

    // ряд и колонка проверяемой ячейки на карте
    let cellRow: number, cellCol: number;

    switch (player.direction) {
        case UP:
            // у верхнего края канваса
            if (playerRow === 0)
                return [undefined, true];

            cellRow = playerRow - 1;
            /* falls through */
        case DOWN:
            cellRow = cellRow ?? playerRow + 1;

            // у нижнего края канваса
            if (player.direction === DOWN && playerRow === GAME_RESOLUTION_TILE_LENGTH_Y - 1)
                return [undefined, true];

            // если ячейка не пустая
            if (map[cellRow][playerCol].length) {
                // if (rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y)
                if (player.y < (cellRow * GAME_RESOLUTION_TILE_SIZE) + GAME_RESOLUTION_TILE_SIZE &&
                    player.y + GAME_RESOLUTION_TILE_SIZE > (cellRow * GAME_RESOLUTION_TILE_SIZE)) {
                    return [
                        {
                            row: cellRow,
                            col: playerCol,
                            distance: calculateOverlapDistance(
                                player.y,
                                cellRow * GAME_RESOLUTION_TILE_SIZE
                            )
                        },
                        false
                    ];
                }
            }

            return [undefined, false];
        case LEFT:
            // у левого края канваса
            if (playerCol === 0) 
                return [undefined, true];

            cellCol = playerCol - 1;
            /* falls through */
        case RIGHT:
            cellCol = cellCol ?? playerCol + 1;

            // у правого края канваса
            if (player.direction === RIGHT && playerCol === GAME_RESOLUTION_TILE_LENGTH_X - 1) 
                return [undefined, true];

            // если ячейка не пустая
            if (map[playerRow][cellCol].length) {
                // if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x)
                if (player.x < (cellCol * GAME_RESOLUTION_TILE_SIZE) + GAME_RESOLUTION_TILE_SIZE &&
                    player.x + GAME_RESOLUTION_TILE_SIZE > (cellCol * GAME_RESOLUTION_TILE_SIZE)) {
                    return [
                        {
                            row: playerRow,
                            col: cellCol,
                            distance: calculateOverlapDistance(
                                player.x,
                                cellCol * GAME_RESOLUTION_TILE_SIZE
                            )
                        },
                        false
                    ];
                }
            }

            return [undefined, false];
    }
};
