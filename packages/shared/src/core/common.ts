import * as Shared from "../idnex";
import { isOutOfBorder, isPlayerCollide } from "./collision";

/**
 * Передвигает игрока. Если направление движения поменялось, 
 * обновляет направление и выравнивает игрока по оси обратной его движению: 
 * если движется по Y - выравнивает по X, а если движется по X - выравнивает по Y.
 * 
 * @param player - игрок
 * @param direction - направление движения
 * @param map - состояние игровой карты
 * @returns данные о ячейке, пресеченной игроком
 */
export const movePlayer = (
    player: Shared.Interfaces.IGameStatePlayer,
    direction: Shared.Enums.MoveDirections,
    map: number[][][]
): Shared.Interfaces.IOverlapData => {
    const { UP, RIGHT, DOWN } = Shared.Enums.MoveDirections;

    // по какой оси движется игрок
    const axisAlongWhichPlayerMoves = [UP, DOWN].includes(direction) ? "y" : "x";
    // поменялось ли направление движения
    const isDirectionChanged = player.direction !== direction;

    if (isDirectionChanged)
        // меняем направление в состоянии, если изменилось
        player.direction = direction;

    // передвигаем игрока
    player[axisAlongWhichPlayerMoves] += (player.speed + 6) * ([RIGHT, DOWN].includes(direction) ? 1 : - 1);

    if (isOutOfBorder(player)) {
        // выравниваем игрока, если он вышел за границу канваса
        alignPlayer(player, axisAlongWhichPlayerMoves);
        return;
    }

    const [overlapData, atEdgeOfBorder] = checkPlayerOverlap(player, map);

    if (overlapData && isPlayerCollide(map[overlapData.row][overlapData.col]))
        // выравниваем игрока, если он с чем-то столкнулся
        alignPlayer(player, axisAlongWhichPlayerMoves);
    else if (isDirectionChanged && !atEdgeOfBorder)
        // выравниваем игрока по обратной оси, если он не у границы
        alignPlayer(player, axisAlongWhichPlayerMoves === "x" ? "y" : "x");

    return overlapData;
};

/**
 * Перебирает идентификаторы игровых сущностей 
 * из ячейки, с которой игрок пересёкся.
 * 
 * @param overlapData - данные о пересечении
 * @param map - карта
 * @param player - игрок
 */
export const filterOverlapData = (
    overlapData: Shared.Interfaces.IOverlapData,
    map: number[][][],
    player: Shared.Interfaces.IGameStatePlayer
) => {
    const { GAME_RESOLUTION_TILE_OFFSET } = Shared.Constants;

    // учитываем оступы в пикселях при отрисовке спрайтов
    if (overlapData.distance <= GAME_RESOLUTION_TILE_OFFSET * 2)
        return;

    const cellEntities = map[overlapData.row][overlapData.col];

    for (let entityId of cellEntities) {
        switch (entityId) {
            // TODO: перебрать сущности
        }
    }
};

/**
 * Проверяет пересечение игрока с ячейкой на карте.
 * 
 * @param player - игрок
 * @param map - карта
 * @returns [информация о ячейке, у границы канваса ли игрок: да, нет]
 */
export const checkPlayerOverlap = (
    player: Shared.Interfaces.IGameStatePlayer,
    map: number[][][]
): [Shared.Interfaces.IOverlapData, boolean] => {
    const { calculatePlayerCellPosition, calculateOverlapDistance } = Shared.Helpers;
    const { UP, LEFT, RIGHT, DOWN } = Shared.Enums.MoveDirections;
    const { GAME_RESOLUTION_TILE_LENGTH_X, GAME_RESOLUTION_TILE_LENGTH_Y, GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

    const [playerRow, playerCol] = calculatePlayerCellPosition(player);

    // ряд и колонка проверяемой ячейки на карте
    let cellRow: number, cellCol: number;

    switch (player.direction) {
        case UP:
            // у верхнего края канваса
            if (playerRow === 0) return [undefined, true];

            cellRow = playerRow - 1;
        case DOWN:
            cellRow = cellRow ?? playerRow + 1;

            // у нижнего края канваса
            if (player.direction === DOWN && playerRow === GAME_RESOLUTION_TILE_LENGTH_Y - 1) return [undefined, true];

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
            if (playerCol === 0) return [undefined, true];

            cellCol = playerCol - 1;
        case RIGHT:
            cellCol = cellCol ?? playerCol + 1;

            // у правого края канваса
            if (player.direction === RIGHT && playerCol === GAME_RESOLUTION_TILE_LENGTH_X - 1) return [undefined, true];

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

/**
 * Выравнивает игрока в клетке, большую часть которой он занимает.
 * 
 * @param player - игрок
 * @param axis - по какой оси выравнивать (X или Y)
 */
export const alignPlayer = (
    player: Shared.Interfaces.IGameStatePlayer,
    axis: "x" | "y"
) => {
    const { GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

    player[axis] = Math.round(player[axis] / GAME_RESOLUTION_TILE_SIZE) * GAME_RESOLUTION_TILE_SIZE;
};

/**
 * Устанвливает бомбу. Добавляет идентификатор бомбы в 
 * ячейку карты. Через таймаут удаляет идентификатор из ячейки.
 * 
 * @param state - игровое состояние
 * @param color - цвет игрока, поставившего бомбу
 */
export const placeBomb = (
    state: Shared.Interfaces.IGameState,
    color: Shared.Enums.PlayerColors
) => {
    const { GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT } = Shared.Constants;
    const { calculatePlayerCellPosition, getBombIdByPlayerColor } = Shared.Helpers;

    const [playerRow, playerCol] = calculatePlayerCellPosition(state.players[color]);
    const bombId = getBombIdByPlayerColor(color);

    addEntityToMap(bombId, state.map, playerRow, playerCol);
    --state.players[color].bombs;

    setTimeout(() => {
        ++state.players[color].bombs;
        removeEntityFromMap(bombId, state.map, playerRow, playerCol);
    }, GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT);
};

/**
 * Меняет состояние карты. Добавляет игровую сущность в ячейку.
 * 
 * @param entityId - идентификатор игровой сущности
 * @param map - игровая карта
 * @param row - ряд ячейки
 * @param col - колонка ячейки
 */
export const addEntityToMap = (entityId: number, map: number[][][], row: number, col: number) => {
    const entities = [...map[row][col]];

    entities.push(entityId);

    map[row][col] = entities;
};

/**
 * Меняет состояние карты. Удаляет игровую сущность из ячейки.
 * 
 * @param entityId - идентификатор игровой сущности
 * @param map - игровая карта
 * @param row - ряд ячейки
 * @param col - колонка ячейки
 */
export const removeEntityFromMap = (entityId: number, map: number[][][], row: number, col: number) => {
    const entities = [...map[row][col]];
    const entitityIndex = entities.findIndex(id => id === entityId);

    entities.splice(entitityIndex, 1);

    map[row][col] = entities;
};

/**
 * Пытается передвинуть игрока, если были нажаты клавиши.
 * 
 * @param keys - нажатые клавиши
 * @returns [двигать ли игрока: да или нет, в каком направлении]
 */
export const tryToMovePlayer = (keys: number[]): [boolean, number] => {
    const { MoveDirections, InputKeys } = Shared.Enums;

    switch (true) {
        case keys.includes(InputKeys.INPUT_KEY_W):
            return [true, MoveDirections.UP];
        case keys.includes(InputKeys.INPUT_KEY_D):
            return [true, MoveDirections.RIGHT];
        case keys.includes(InputKeys.INPUT_KEY_S):
            return [true, MoveDirections.DOWN];
        case keys.includes(InputKeys.INPUT_KEY_A):
            return [true, MoveDirections.LEFT];
    }

    return [false, null];
};

/**
 * Пытается поставить бомбу, если были нажаты клавиши.
 * 
 * @param keys - нажатые клавиши
 * @param state - игровое состояние
 * @param color - цвет игрока, пытающегося поставить бомбу
 * @returns можно ли ставить бомбу: да или нет
 */
export const tryToPlaceBomb = (
    keys: number[],
    state: Shared.Interfaces.IGameState,
    color: number
): boolean => {
    const { calculatePlayerCellPosition, getAllEntitiesInCell, getAllBombsIds } = Shared.Helpers;
    const { INPUT_KEY_SPACE } = Shared.Enums.InputKeys;

    if (!keys.includes(INPUT_KEY_SPACE)) 
        return false;
        
    if (state.players[color].bombs === 0) 
        return false;

    const [playerRow, playerCol] = calculatePlayerCellPosition(state.players[color]);

    for (let eintity of getAllEntitiesInCell(state.map, playerRow, playerCol))
        if (getAllBombsIds().includes(eintity)) 
            return false;

    return true;
};
