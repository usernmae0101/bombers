import * as Shared from "@bombers/shared/src/idnex";
import { isOutOfBorder, isPlayerCollide } from "./collision";
import { calculatePlayerCellPosition, getBombIdByPlayerColor, calculateOverlapDistance } from "./../utils/helpers";

interface IBlazeList {
    /** Идентификатор игровой сущности пламени. */
    id: Shared.Enums.EntityNumbers;
    /** Ряд ячейки на карте. */
    row: number;
    /** Колонка ячейки на карте. */
    col: number;
}

interface IDirectionBlazeState {
    /** Продолжать ли распространять пламя в направлении. */
    isStopped: boolean;
    /** Идентификатор сущности края пламени для направления. */
    edge: Shared.Enums.EntityNumbers;
    /** Идентификатор сущности промежуточного пламени для направления. */
    middle: Shared.Enums.EntityNumbers;
    /** Ряд ячейки на карте, куда добавлять пламя. */
    row: number;
    /** На какое число увеличивать ячейки. */
    increaseBy: 1 | -1;
    /** Колонка ячейки на карте, куда добавлять пламя. */
    col: number;
    /** В каком направлении распространять. */
    spreadBy: "col" | "row";
    /** Предельный порядковый номер ячейки для направления. */
    limitSpread: number;
}

/**
 * Передвигает игрока. Если направление движения поменялось, 
 * обновляет направление и выравнивает игрока по оси обратной его движению: 
 * если движется по Y - выравнивает по X, а если движется по X - выравнивает по Y.
 * 
 * @param player - игрок
 * @param direction - направление движения
 * @param map - состояние игровой карты
 * @returns данные о ячейке, пресечённой игроком
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
        // выравниваем игрока по обратной оси, если он не у границы и не столкнулся
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
export const alignPlayer = (player: Shared.Interfaces.IGameStatePlayer, axis: "x" | "y") => {
    const { GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

    player[axis] = Math.round(player[axis] / GAME_RESOLUTION_TILE_SIZE) * GAME_RESOLUTION_TILE_SIZE;
};

/**
 * Добавляет бомбу на игровую карту. Уменьшает количество доступных
 * бомб у игрока, поставившего бомбу. Через таймаут вызывает функцию
 * удаления бомбы.
 * 
 * @param state - игровое состояние
 * @param color - цвет игрока, поставившего бомбу
 */
export const placeBombToMap = (state: Shared.Interfaces.IGameState, color: Shared.Enums.PlayerColors) => {
    const [playerRow, playerCol] = calculatePlayerCellPosition(state.players[color]);

    addEntityToMap(getBombIdByPlayerColor(color), state.map, playerRow, playerCol);
    --state.players[color].bombs;

    setTimeout(
        removeBombFromMap,
        Shared.Constants.GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT,
        [playerRow, playerCol], state, color
    );
};

/**
 * Удаляет бомбу с игровой карты. Увеличивает количество
 * доступных бомб у игрока, поставившего бомбу. Добавляет 
 * кратер на карту. Вызывает функцию взрыва бомбы.
 * 
 * @param epicetner - эпицентр взрыва на карте [ряд ячеки, колонка ячейки]
 * @param state - игровое состояние
 * @param color - цвет игрока, поставившего бомбу
 */
export const removeBombFromMap = (
    epicenter: [number, number],
    state: Shared.Interfaces.IGameState,
    color: Shared.Enums.PlayerColors
) => {
    const [epicenterRow, epicenterCol] = epicenter;
    
    // TODO: добавить кратер

    removeEntityFromMap(getBombIdByPlayerColor(color), state.map, epicenterRow, epicenterCol);
    ++state.players[color].bombs;

    detonateBomb([epicenterRow, epicenterCol], state.map, state.players[color].radius);
};

/**
 * Взрывает бомбу. Расчитывает радиус по каждому направлению и
 * добавляет идентификаторы пламени в ячейки на игровой карте.
 * 
 * @param epicenter - эпицентр взрыва на карте [ряд ячеки, колонка ячейки]
 * @param map - игровая карта
 * @param radius - радиус взрыва у игрока, поставившего бомбу
 */
export const detonateBomb = (
    epicenter: [number, number],
    map: number[][][],
    radius: number
) => {
    const { EntityNumbers } = Shared.Enums;
    const { GAME_RESOLUTION_TILE_LENGTH_Y, GAME_RESOLUTION_TILE_LENGTH_X, GAME_GAMEPLAY_BLAZE_TIME_TO_SHOW } = Shared.Constants;

    const [epicenterRow, epicenterCol] = epicenter;
    const orientationDict = { row: epicenterRow, col: epicenterCol };

    // создаём массив, куда будем складывать пламя. добавляем туда эпицентер
    const blaze: IBlazeList[] = [{ row: epicenterRow, col: epicenterCol, id: EntityNumbers.FIRE_CENTER }];

    const directions = {
        LEFT: {
            isStopped: false,
            edge: EntityNumbers.FIRE_LEFT,
            middle: EntityNumbers.FIRE_MIDDLE_X,
            row: epicenterRow,
            increaseBy: - 1,
            col: epicenterCol,
            spreadBy: "col",
            limitSpread: 0
        },
        RIGHT: {
            isStopped: false,
            edge: EntityNumbers.FIRE_RIGHT,
            middle: EntityNumbers.FIRE_MIDDLE_X,
            row: epicenterRow,
            increaseBy: 1,
            col: epicenterCol,
            spreadBy: "col",
            limitSpread: GAME_RESOLUTION_TILE_LENGTH_X - 1
        },
        UP: {
            isStopped: false,
            edge: EntityNumbers.FIRE_TOP,
            middle: EntityNumbers.FIRE_MIDDLE_Y,
            row: epicenterRow,
            increaseBy: - 1,
            col: epicenterCol,
            spreadBy: "row",
            limitSpread: 0
        },
        DOWN: {
            isStopped: false,
            edge: EntityNumbers.FIRE_BOTTOM,
            middle: EntityNumbers.FIRE_MIDDLE_Y,
            row: epicenterRow,
            increaseBy: 1,
            col: epicenterCol,
            spreadBy: "row",
            limitSpread: GAME_RESOLUTION_TILE_LENGTH_Y - 1
        }
    };

    for (let _radius = 1; _radius <= radius; _radius++) {
        for (let direction in directions) {
            const _direction = <IDirectionBlazeState>directions[direction as "LEFT" | "RIGHT" | "UP" | "DOWN"]; 

            if (!_direction.isStopped) {
                const { spreadBy, increaseBy, limitSpread } = _direction;

                // распространяем пламя по направлению
                _direction[spreadBy] += increaseBy;

                // если пламя на границе (или вышли за границу) канваса
                if (limitSpread <= (_direction[spreadBy] * increaseBy)) {
                    // если эпицентр не на границе - добавляем край
                    if (orientationDict[spreadBy] !== limitSpread) {
                        // выравниваем пламя по границе
                        _direction[spreadBy] = limitSpread;

                        blaze.push({
                            id: _direction.edge,
                            col: _direction.col,
                            row: _direction.row
                        });
                    }

                    _direction.isStopped = true;
                    continue;
                }

                const entitiesInCell = map[_direction.row][_direction.col];

                // если пламя наткнулось на камень
                if (entitiesInCell.includes(EntityNumbers.ROCK)) {
                    // добавляем край, если соседняя клетка - не эпицентр
                    if (Math.abs(orientationDict[spreadBy] - _direction[spreadBy]) > 1) {
                        // смещаем пламя обратно по направлению
                        _direction[spreadBy] -= increaseBy;

                        blaze.push({
                            id: _direction.edge,
                            col: _direction.col,
                            row: _direction.row
                        });
                    }

                    _direction.isStopped = true;
                    continue;
                }

                // если пламя наткнулось на коробку
                if (entitiesInCell.includes(EntityNumbers.BOX)) {
                    blaze.push({
                        id: _direction.edge,
                        col: _direction.col,
                        row: _direction.row
                    });

                    destroyBoxFromMap(map, _direction.row, _direction.col);

                    _direction.isStopped = true;
                    continue;
                }

                // добавляем край пламени, если конец радиуса. в ином случае - середину пламени
                blaze.push({
                    id: _radius === radius ? _direction.edge : _direction.middle,
                    col: _direction.col,
                    row: _direction.row
                });
            }
        }
    }

    const argumentsToUpdateBlazeFunc = [blaze, map];

    // добавляем пламя на карту
    updateBlazeDependsCallback(
        argumentsToUpdateBlazeFunc[0] as IBlazeList[],
        argumentsToUpdateBlazeFunc[1] as number[][][],
        addEntityToMap
    );

    // удаляем через интервал
    setTimeout(
        updateBlazeDependsCallback,
        GAME_GAMEPLAY_BLAZE_TIME_TO_SHOW,
        argumentsToUpdateBlazeFunc[0],
        argumentsToUpdateBlazeFunc[1],
        removeEntityFromMap
    );
};

/**
 * Обновляет состояние пламени на карте. Добавляет
 * или удаляет, в зависимости от переданного коллбека.
 * 
 * @param blaze - пламя (список с информацией о заполнении)
 * @param map - игровая карта
 * @param callback - функция удаляения или добавления сущности на карту
 */
export const updateBlazeDependsCallback = (
    blaze: IBlazeList[],
    map: number[][][],
    callback: (entityId: number, map: number[][][], row: number, col: number) => void
) => {
    for (let fire of blaze) {
        callback(fire.id, map, fire.row, fire.col);
    }
};

/**
 * Удаляет коробку с игровой карты. С вероятностью, заданной
 * константным значением, выбрасывает из коробки случайный
 * предмет и добавляет его на карту.
 * 
 * @param map - игровая карта
 * @param row - ряд ячейки на карте
 * @param col - ряд колонки на карте
 */
export const destroyBoxFromMap = (map: number[][][], row: number, col: number) => {
    const { EntityNumbers } = Shared.Enums;
    const { getRandomBetween } = Shared.Maths;
    const { GAME_GAMEPLAY_DROP_ITEM_PERCENT } = Shared.Constants;
    const { chooseRandomBonusItem } = Shared.Helpers;

    // удаляем коробку
    removeEntityFromMap(EntityNumbers.BOX, map, row, col);

    if (GAME_GAMEPLAY_DROP_ITEM_PERCENT <= getRandomBetween(1, 100)) {
        // добавляем случайный предмет
        addEntityToMap(chooseRandomBonusItem(), map, row, col);
    }
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
