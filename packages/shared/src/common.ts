import * as Shared from "@bombers/shared/src/idnex";
import { checkPlayerOverlap, isOutOfBorder, isPlayerCollide } from "./collision";

/**
 * Перебирает идентификаторы игровых сущностей из ячейки, с которой 
 * игрок пересёкся. Удаляет поднятый бонусный предмет с карты.
 */
export const filterOverlapData = (
    overlapData: Shared.Interfaces.IOverlapData,
    proxyState: Shared.Interfaces.IGameState,
    color: Shared.Enums.PlayerColors,
    bombsState: Shared.Interfaces.IBombsState
) => {
    const { EntityNumbers } = Shared.Enums;
    const { GAME_RESOLUTION_TILE_OFFSET } = Shared.Constants;

    // учитываем оступы в пикселях при отрисовке спрайтов
    if (overlapData.distance <= GAME_RESOLUTION_TILE_OFFSET * 2)
        return;

    const cellEntities = proxyState.map[overlapData.row][overlapData.col];

    for (let entityId of cellEntities) {
        switch (entityId) {
            case EntityNumbers.FIRE_CENTER:
            case EntityNumbers.FIRE_BOTTOM:
            case EntityNumbers.FIRE_LEFT:
            case EntityNumbers.FIRE_TOP:
            case EntityNumbers.FIRE_RIGHT:
            case EntityNumbers.FIRE_MIDDLE_X:
            case EntityNumbers.FIRE_MIDDLE_Y:
                tryToDamagePlayer(proxyState, color);
                break;
            case EntityNumbers.ITEM_BOMB:
            case EntityNumbers.ITEM_HEALTH:
            case EntityNumbers.ITEM_RADIUS:
            case EntityNumbers.ITEM_SPEED:
                pickUpBonusItem(
                    entityId, 
                    proxyState.players[color], 
                    color, 
                    bombsState
                );
                removeEntityFromMap(
                    entityId, 
                    proxyState.map, 
                    overlapData.row, 
                    overlapData.col
                );
        }
    }
};

/**
 * Наносит урон игроку, который коснулся пламени. Если у игрока кончилось 
 * здоровье, удаляет его из игового сотояния.
 */
export const tryToDamagePlayer = (
    state: Shared.Interfaces.IGameState,
    color: Shared.Enums.PlayerColors
) => {
    const { GAME_GAMEPLAY_PLAYER_IMMORTAL_INTERVAL } = Shared.Constants;
    
    if (state.players[color] === undefined || Object.keys(state.players).length === 1)
        return;

    if (!state.players[color].isImmortal) {
        // удаляем игрока из состояния
        if (state.players[color].health === 1) {
            delete state.players[color];
            return;
        }

        --state.players[color].health;

        // делаем игрока неуязвимым
        state.players[color].isImmortal = true;

        // возвращаем уязвимость через таймаут
        setTimeout(
            () => { 
                state.players[color].isImmortal = false; 
            },
            GAME_GAMEPLAY_PLAYER_IMMORTAL_INTERVAL
        );
    }
};

/**
 * Применяет бонусный предмет на игрока, если у игрока 
 * не достигнуты лимиты на предмет.
 */
export const pickUpBonusItem = (
    entityId: Shared.Enums.EntityNumbers,
    player: Shared.Interfaces.IGameStatePlayer,
    color: Shared.Enums.PlayerColors,
    bombsState: Shared.Interfaces.IBombsState
) => {
    const { EntityNumbers } = Shared.Enums;
    const {
        GAME_GAMEPLAY_PLAYER_PROPERTY_BOMBS_LIMIT,
        GAME_GAMEPLAY_PLAYER_PROPERTY_HEALTH_LIMIT,
        GAME_GAMEPLAY_PLAYER_PROPERTY_RADIUS_LIMIT,
        GAME_GAMEPLAY_PLAYER_PROPERTY_SPEED_LIMIT
    } = Shared.Constants;

    // подобрали бомбу
    if (entityId === EntityNumbers.ITEM_BOMB) {
        if (player.bombs < GAME_GAMEPLAY_PLAYER_PROPERTY_BOMBS_LIMIT) {
            ++player.bombs;
            ++bombsState[color];
        }
    }
    // подобрали скорость
    else if (entityId === EntityNumbers.ITEM_SPEED) {
        if (player.speed < GAME_GAMEPLAY_PLAYER_PROPERTY_SPEED_LIMIT) {
            player.speed += 2;
        }
    }
    // подобрали здоровье
    else if (entityId === EntityNumbers.ITEM_HEALTH) {
        if (player.health < GAME_GAMEPLAY_PLAYER_PROPERTY_HEALTH_LIMIT) {
            ++player.health;
        }
    }
    // подобрали радиус
    else if (entityId === EntityNumbers.ITEM_RADIUS) {
        if (player.radius < GAME_GAMEPLAY_PLAYER_PROPERTY_RADIUS_LIMIT) {
            ++player.radius;
        }
    }
};

/**
 * Передвигает игрока. Если направление движения поменялось, 
 * обновляет направление и выравнивает игрока по оси обратной его движению: 
 * если движется по Y - выравнивает по X, а если движется по X - выравнивает по Y.
 * 
 * @returns данные о ячейке, пресеbчённой игроком
 */
export const movePlayer = (
    player: Shared.Interfaces.IGameStatePlayer,
    direction: Shared.Enums.MoveDirections,
    map: number[][][],
): Shared.Interfaces.IOverlapData => {
    const { UP, LEFT, DOWN } = Shared.Enums.MoveDirections;

    const axisAlongWhichPlayerMoves = [UP, DOWN].includes(direction) ? "y" : "x";
    const isDirectionChanged = player.direction !== direction;

    if (isDirectionChanged) 
        player.direction = direction;

    let speed;
    switch (player.speed) {
        case 2: speed = 3;
            break;
        case 4: speed = 4;
            break;
        case 6: speed = 5;
            break;
        case 8: speed = 6;
            break;
        case 10: speed = 7;
    }
    
    // передвигаем игрока
    player[axisAlongWhichPlayerMoves] += [UP, LEFT].includes(direction) ? -speed : speed;

    if (isOutOfBorder(player)) {
        alignPlayer(
            player, 
            axisAlongWhichPlayerMoves
        );
        return;
    }

    const [overlapData, atEdgeOfBorder] = checkPlayerOverlap(player, map);

    // если игрок пересёкся с объктом о который бьется (collided), 
    // выравнивам игрока по оси движения
    if (overlapData && isPlayerCollide(map, overlapData, speed)) 
        alignPlayer(
            player, 
            axisAlongWhichPlayerMoves
        );

    // если игрок не столкнулся, направление движения поменялось 
    // и не у края канваса, выравниваем игрока по оси обратной его движению
    else if (isDirectionChanged && !atEdgeOfBorder) 
        alignPlayer(
            player, 
            axisAlongWhichPlayerMoves === "x" ? "y" : "x"
        );

    return overlapData;
};

/**
 * Выравнивает игрока в клетке, большую часть которой он занимает.
 */
export const alignPlayer = (
    player: Shared.Interfaces.IGameStatePlayer, 
    axis: "x" | "y"
) => {
    const { GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;
    
    player[axis] = Math.round(player[axis] / GAME_RESOLUTION_TILE_SIZE) * GAME_RESOLUTION_TILE_SIZE;
};

/**
 * Удаляет коробку с игровой карты. С вероятностью, заданной 
 * константным значением, выбрасывает из коробки случайный 
 * предмет и добавляет его на карту.
 */
export const destroyBoxFromMap = (
    map: number[][][], 
    row: number, 
    col: number,
    decreaseBoxes: () => void
) => {
    const { EntityNumbers } = Shared.Enums;
    const { getRandomBetween } = Shared.Maths;
    const { GAME_GAMEPLAY_DROP_ITEM_PERCENT } = Shared.Constants;
    const { chooseRandomBonusItem } = Shared.Helpers;

    // удаляем коробку
    removeEntityFromMap(EntityNumbers.BOX, map, row, col);

    // уменьшаем счетчик коробок на карте
    decreaseBoxes();

    // добавляем случайный предмет
    if (GAME_GAMEPLAY_DROP_ITEM_PERCENT <= getRandomBetween(1, 100)) { 
        addEntityToMap(
            chooseRandomBonusItem(), 
            map, 
            row, 
            col
        );
    }
};

/**
 * Меняет состояние карты. Добавляет игровую сущность в ячейку.
 */
export const addEntityToMap = (
    entityId: number, 
    map: number[][][], 
    row: number, 
    col: number
) => {
    const entities = [...map[row][col]];
    entities.push(entityId);
    map[row][col] = entities;
};

/**
 * Меняет состояние карты. Удаляет игровую сущность из ячейки.
 */
export const removeEntityFromMap = (
    entityId: number, 
    map: number[][][], 
    row: number, 
    col: number
) => {
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
export const tryToMovePlayer = (
    keys: number[]
): [boolean, number] => {
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
 * Возвращает список ячеек, которые занимает игрок.
 */
export const getPlayerOccupiedCells = (
    player: Shared.Interfaces.IGameStatePlayer
): Shared.Interfaces.ICell[] => {
    const xPos = player.x;
    const yPos = player.y;

    const [pRow, pCol] = Shared.Helpers.calculatePlayerCellPosition(
        player
    );

    const xRem = xPos % Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
    const yRem = yPos % Shared.Constants.GAME_RESOLUTION_TILE_SIZE;

    // занимаемые ячейки
    const takes: Shared.Interfaces.ICell[] = [
        { 
            col: pCol, 
            row: pRow 
        }
    ];

    // если занимает две ячейки
    if (!(xRem === 0 && yRem === 0)) {
        // выровнен по Y
        if (xRem !== 0) {
            const rest = xPos - (pCol * Shared.Constants.GAME_RESOLUTION_TILE_SIZE);     
            if (Math.abs(rest) > Shared.Constants.GAME_RESOLUTION_TILE_OFFSET) {
                takes.push({
                    row: pRow,
                    col: rest > 0 ? pCol + 1 : pCol - 1
                });
            }
        }

        // выровнен по X
        else {
            const rest = yPos - (pRow * Shared.Constants.GAME_RESOLUTION_TILE_SIZE);     
            if (Math.abs(rest) > Shared.Constants.GAME_RESOLUTION_TILE_OFFSET) {
                takes.push({
                    col: pCol,
                    row: rest > 0 ? pRow + 1 : pRow - 1
                });
            }
        }
    }
    
    return takes;
};

/**
 * Пытается поставить бомбу, если были нажаты клавиши.
 * 
 * @param keys - нажатые клавиши
 * @param state - игровое состояние
 * @param color - цвет игрока
 * @returns можно ли ставить бомбу: да или нет
 */
export const tryToPlaceBomb = (
    keys: number[],
    state: Shared.Interfaces.IGameState,
    bombsState: Shared.Interfaces.IBombsState,
    color: number
): boolean => {
    const { 
        calculatePlayerCellPosition, 
        getAllEntitiesInCell, 
        getAllBombsIds 
    } = Shared.Helpers;
    const { INPUT_KEY_SPACE } = Shared.Enums.InputKeys;

    if (!keys.includes(INPUT_KEY_SPACE))
        return false;

    if (bombsState[color] === 0)
        return false;

    const [
        playerRow, 
        playerCol
    ] = calculatePlayerCellPosition(state.players[color]);

    const allEntities = getAllEntitiesInCell(
        state.map, 
        playerRow, 
        playerCol
    );
    
    // проверяем, есть ли в ячейке бомба любого цвета
    for (let eintity of allEntities)
        if (getAllBombsIds().includes(eintity))
            return false;

    return true;
};
