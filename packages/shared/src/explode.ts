import * as Shared from "@bombers/shared/src/idnex";
import { addEntityToMap, tryToDamagePlayer, destroyBoxFromMap, removeEntityFromMap } from "./common";
import { calculatePlayerCellPosition, getBombIdByPlayerColor } from "./utils/helpers";

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
 * @param state
 * @param bombsState
 * @param color
 */
export const placeBombToMap = (
    state: Shared.Interfaces.IGameState, 
    bombsState: Shared.Interfaces.IBombsState,
    color: Shared.Enums.PlayerColors
) => {
    const [playerRow, playerCol] = calculatePlayerCellPosition(state.players[color]);

    addEntityToMap(getBombIdByPlayerColor(color), state.map, playerRow, playerCol);
    --bombsState[color];

    const args = [[playerRow, playerCol], state, bombsState, color, state.players[color].radius];
    
    // удаляем бомбу через таймаут
    setTimeout(removeBombFromMap, Shared.Constants.GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT, ...args);
};

/**
 * Удаляет бомбу с игровой карты. Увеличивает количество
 * доступных бомб у игрока, поставившего бомбу. Добавляет 
 * кратер на карту. Вызывает функцию взрыва бомбы.
 * 
 * @param epicetner - [ряд ячеки, колонка ячейки]
 * @param proxyState
 * @param bombsState
 * @param color
 * @param radius
 */
export const removeBombFromMap = (
    epicenter: [number, number],
    proxyState: Shared.Interfaces.IGameState,
    bombsState: Shared.Interfaces.IBombsState,
    color: Shared.Enums.PlayerColors,
    radius: number
) => {
    const [epicenterRow, epicenterCol] = epicenter;

    removeEntityFromMap(getBombIdByPlayerColor(color), proxyState.map, epicenterRow, epicenterCol);
    ++bombsState[color];

    // добавляем кратер, если его нет в ячейке на карте
    if (!proxyState.map[epicenterRow][epicenterCol].includes(EntityNumbers.CRATER))
        addEntityToMap(EntityNumbers.CRATER, proxyState.map, epicenterRow, epicenterCol);

    detonateBomb([epicenterRow, epicenterCol], proxyState, radius);
};

/**
 * Взрывает бомбу. Расчитывает радиус по каждому направлению и
 * добавляет идентификаторы пламени в ячейки на игровой карте.
 * 
 * @param epicenter - [ряд ячеки, колонка ячейки]
 * @param proxyState
 * @param radius
 */
export const detonateBomb = (
    epicenter: [number, number],
    proxyState: Shared.Interfaces.IGameState,
    radius: number
) => {
    const map = proxyState.map;
    const players = proxyState.players;

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

    // проверяем, задело ли кого-нибудь из игроков
    for (let color in players) {
        const xPos = players[+color].x;
        const yPos = players[+color].y;

        const [pRow, pCol] = Shared.Helpers.calculatePlayerCellPosition(players[+color])

        const xRem = xPos % Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
        const yRem = yPos % Shared.Constants.GAME_RESOLUTION_TILE_SIZE;

        // занимаемые ячейки
        const takes: { row: number; col: number; }[] = [{ col: pCol, row: pRow }];

        // занимает одну ячейку
        if (!(xRem === 0 && yRem === 0)) {
            // воровнен по Y
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

        for (let { row, col } of takes) {
            for (let entity of map[row][col]) {
                if ([
                    EntityNumbers.FIRE_CENTER,
                    EntityNumbers.FIRE_BOTTOM,
                    EntityNumbers.FIRE_LEFT,
                    EntityNumbers.FIRE_TOP,
                    EntityNumbers.FIRE_RIGHT,
                    EntityNumbers.FIRE_MIDDLE_X,
                    EntityNumbers.FIRE_MIDDLE_Y
                ].includes(entity))
                    tryToDamagePlayer(proxyState, +color);
            }     
        }
    }

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
 * @param blaze
 * @param map
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
