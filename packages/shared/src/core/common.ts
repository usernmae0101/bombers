import * as Shared from "../idnex";

/**
 * Передвигает игрока. Если направление движения поменялось, 
 * обновляет направление и выравнивает игрока по оси обратной его движению: 
 * если движется по Y - выравнивает по X, а если движется по X - выравнивает по Y.
 * 
 * @param player - игрок
 * @param direction - направление движения
 */
export const movePlayer = (
    player: Shared.Interfaces.IGameStatePlayer,
    direction: Shared.Enums.MoveDirections
) => {
    const { UP, LEFT, RIGHT, DOWN } = Shared.Enums.MoveDirections;

    if (player.direction !== direction) {
        if ([UP, DOWN].includes(direction))
            alignPlayer(player, "x");

        if ([LEFT, RIGHT].includes(direction))
            alignPlayer(player, "y");

        player.direction = direction;
    }

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
};

/**
 * Выравнивает игрока в клетке, большую часть которой он занимает.
 * 
 * @param player - игрок
 * @param axis - по какой оси выравнивать (x или y)
 */
export const alignPlayer = (
    player: Shared.Interfaces.IGameStatePlayer,
    axis: "x" | "y"
) => {
    const { GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

    player[axis] = Math.round(player[axis] / GAME_RESOLUTION_TILE_SIZE) * GAME_RESOLUTION_TILE_SIZE;
};

/**
 * Устанавливает бомбу.
 * 
 * @param state - игровое состояние
 * @param color - цвет игрока, поставившего бомбу
 */
export const placeBomb = (
    state: Shared.Interfaces.IGameState,
    color: Shared.Enums.PlayerColors
) => {
    const { GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT } = Shared.Constants;

    const [playerRow, playerCol] = Shared.Helpers.calculatePlayerCellPosition(state.players[color]);
    const bombId = Shared.Helpers.getBombIdByPlayerColor(color);

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
