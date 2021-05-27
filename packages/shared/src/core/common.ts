import * as Shared from "../idnex";
import { isOutOfBorder } from "./collision";

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
    const { isPlayerCollide } = Shared.Helpers;
    const { UP, LEFT, RIGHT, DOWN } = Shared.Enums.MoveDirections;

    // по какой оси движется игрок
    const axisAlongWhichPlayerMoves = [UP, DOWN].includes(direction) ? "y" : "x";
    // поменялось ли направление движения
    const isDirectionChanged = player.direction !== direction;

    if (isDirectionChanged)
        player.direction = direction;

    // TODO: добавить формулу
    switch (direction) {
        case UP:
            player.y -= player.speed + 6;
            break;
        case RIGHT:
            player.x += player.speed + 6;
            break;
        case DOWN:
            player.y += player.speed + 6;
            break;
        case LEFT:
            player.x -= player.speed + 6;
    }

    if (isOutOfBorder(player)) {
        // выравниваем игрока, если он вышел за границу канваса
        alignPlayer(player, axisAlongWhichPlayerMoves);
        return;
    }

    const overlapData = checkPlayerOverlap(player, map);
    if (overlapData && isPlayerCollide(overlapData, map)) {
        // выравниваем игрока, если он с чем-то столкнулся
        alignPlayer(player, axisAlongWhichPlayerMoves);
    } 
    // если ни с чем не столкнулся и поменялось направление движения
    else if (isDirectionChanged) {
        if ([UP, DOWN].includes(direction))
            alignPlayer(player, "x");

        if ([LEFT, RIGHT].includes(direction))
            alignPlayer(player, "y");
    }

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
 * @returns информация о ячейке, которая была пересечена игроком
 */
export const checkPlayerOverlap = (
    player: Shared.Interfaces.IGameStatePlayer,
    map: number[][][]
): undefined | Shared.Interfaces.IOverlapData => {
    const { calculatePlayerCellPosition, calculateOverlapDistance } = Shared.Helpers;
    const { UP, LEFT, RIGHT, DOWN } = Shared.Enums.MoveDirections;
    const { GAME_RESOLUTION_TILE_LENGTH_X, GAME_RESOLUTION_TILE_LENGTH_Y, GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

    const [playerRow, playerCol] = calculatePlayerCellPosition(player);

    // ряд и колонка проверяемой ячейки на карте
    let cellRow: number, cellCol: number;

    switch (player.direction) {
        case UP:
            cellRow = playerRow - 1;
        case DOWN:
            cellRow = cellRow ?? playerRow + 1;
            // у верхнего или нижнего края канваса
            if (playerRow === 0 || playerRow === GAME_RESOLUTION_TILE_LENGTH_Y - 1) return;

            // если ячейка не пустая
            if (map[cellRow][playerCol].length) {
                // if (rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y)
                if (player.y < (cellRow * GAME_RESOLUTION_TILE_SIZE) + GAME_RESOLUTION_TILE_SIZE &&
                    player.y + GAME_RESOLUTION_TILE_SIZE > (cellRow * GAME_RESOLUTION_TILE_SIZE)) {
                    return {
                        row: cellRow,
                        col: playerCol,
                        distance: calculateOverlapDistance(
                            player.y,
                            cellRow * GAME_RESOLUTION_TILE_SIZE
                        )
                    };
                }
            }
        case LEFT:
            cellCol = playerCol - 1;
        case RIGHT:
            cellCol = cellCol ?? playerCol + 1;
            // у левого или правого края канваса
            if (playerCol === 0 || playerCol === GAME_RESOLUTION_TILE_LENGTH_X - 1) return;

            // если ячейка не пустая
            if (map[playerRow][cellCol].length) {
                // if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x)
                if (player.x < (cellCol * GAME_RESOLUTION_TILE_SIZE) + GAME_RESOLUTION_TILE_SIZE &&
                    player.x + GAME_RESOLUTION_TILE_SIZE > (cellCol * GAME_RESOLUTION_TILE_SIZE)) {
                    return {
                        row: playerRow,
                        col: cellCol,
                        distance: calculateOverlapDistance(
                            player.x,
                            cellCol * GAME_RESOLUTION_TILE_SIZE
                        )
                    };
                }
            }
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
    const { INPUT_KEY_SPACE } = Shared.Enums.InputKeys;

    if (!keys.includes(INPUT_KEY_SPACE)) return false;
    if (state.players[color].bombs === 0) return false;

    const [playerRow, playerCol] = Shared.Helpers.calculatePlayerCellPosition(state.players[color]);

    for (let eintity of Shared.Helpers.getAllEntitiesInCell(state.map, playerRow, playerCol))
        if (Shared.Helpers.getAllBombsIds().includes(eintity)) return false;

    return true;
};
