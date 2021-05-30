import * as Shared from "@bombers/shared/src/idnex";
import { addEntityToMap, destroyBoxFromMap, removeEntityFromMap } from ".";
import { calculatePlayerCellPosition, getBombIdByPlayerColor } from "../utils/helpers";

const { EntityNumbers } = Shared.Enums;

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

    removeEntityFromMap(getBombIdByPlayerColor(color), state.map, epicenterRow, epicenterCol);
    ++state.players[color].bombs;

    // добавляем кратер, если его нет в ячейке на карте
    if (!state.map[epicenterRow][epicenterCol].includes(EntityNumbers.CRATER)) {
        addEntityToMap(EntityNumbers.CRATER, state.map, epicenterRow, epicenterCol);
    }

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
                    // выравниваем пламя по границе
                    _direction[spreadBy] = limitSpread;

                    const entitiesInCell = map[_direction.row][_direction.col];

                    // если пламя на границе наткнулось на камень
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
                    }

                    // если эпицентр не на границе - добавляем край
                    else if (orientationDict[spreadBy] !== limitSpread) {
                        blaze.push({
                            id: _direction.edge,
                            col: _direction.col,
                            row: _direction.row
                        });
                    }

                    // если пламя на границе наткнулось на коробку - уничтожаем коробку
                    if (entitiesInCell.includes(EntityNumbers.BOX)) {
                        destroyBoxFromMap(map, _direction.row, _direction.col);
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

    // удаляем пламя через таймаут
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
