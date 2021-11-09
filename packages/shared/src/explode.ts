import * as Shared from "@bombers/shared/src/idnex";
import { debug } from "@bombers/shared/src/tools/debugger";
import { 
    addEntityToMap, 
    tryToDamagePlayer, 
    destroyBoxFromMap, 
    removeEntityFromMap,
    getPlayerOccupiedCells
} from "./common";
import { 
    calculatePlayerCellPosition, 
    getBombIdByPlayerColor 
} from "./utils/helpers";

const { EntityNumbers } = Shared.Enums;

interface IBlazeList {
    id: Shared.Enums.EntityNumbers;
    row: number;
    col: number;
}

interface IDirectionBlazeState {
    isStopped: boolean;
    edge: Shared.Enums.EntityNumbers;
    middle: Shared.Enums.EntityNumbers;
    row: number;
    increaseBy: 1 | -1;
    col: number;
    spreadBy: "col" | "row";
    limitSpread: number;
}

/**
 * Добавляет бомбу на игровую карту. Уменьшает количество доступных
 * бомб у игрока, поставившего бомбу. Через таймаут вызывает функцию
 * удаления бомбы.
 */
export const placeBombToMap = (
    state: Shared.Interfaces.IGameState, 
    bombsState: Shared.Interfaces.IBombsState,
    color: Shared.Enums.PlayerColors,
    decreaseBoxes: () => void
) => {
    const [playerRow, playerCol] = calculatePlayerCellPosition(
        state.players[color]
    );

    addEntityToMap(
        getBombIdByPlayerColor(color), 
        state.map, 
        playerRow, 
        playerCol
    );
    --bombsState[color];

    const args = [
        [playerRow, playerCol], 
        state, 
        bombsState, 
        color, 
        state.players[color].radius,
        decreaseBoxes
    ];
    
    // удаляем бомбу через таймаут
    setTimeout(
        removeBombFromMap, 
        Shared.Constants.GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT, 
        ...args
    );
};

export const removeBombFromMap = (
    epicenter: [number, number],
    proxyState: Shared.Interfaces.IGameState,
    bombsState: Shared.Interfaces.IBombsState,
    color: Shared.Enums.PlayerColors,
    radius: number,
    decreaseBoxes: () => void
) => {
    const [epicenterRow, epicenterCol] = epicenter;

    // удаляем бомбу с карты
    removeEntityFromMap(
        getBombIdByPlayerColor(color), 
        proxyState.map, 
        epicenterRow, 
        epicenterCol
    );
    ++bombsState[color];

    // добавляем кратер, если его нет в ячейке на карте
    if (!proxyState.map[epicenterRow][epicenterCol].includes(EntityNumbers.CRATER)) {
        addEntityToMap(
            EntityNumbers.CRATER, 
            proxyState.map, 
            epicenterRow, 
            epicenterCol
        );
    }

    detonateBomb(
        [epicenterRow, epicenterCol], 
        proxyState, 
        radius,
        decreaseBoxes
    );
};

/**
 * Взрывает бомбу. Расчитывает радиус по каждому направлению и
 * добавляет идентификаторы пламени в ячейки на игровой карте.
 */
export const detonateBomb = (
    epicenter: [number, number],
    proxyState: Shared.Interfaces.IGameState,
    radius: number,
    decreaseBoxes: () => void
) => {
    const map = proxyState.map;
    const players = proxyState.players;

    const { EntityNumbers } = Shared.Enums;
    const { 
        GAME_RESOLUTION_TILE_LENGTH_Y, 
        GAME_RESOLUTION_TILE_LENGTH_X, 
        GAME_GAMEPLAY_BLAZE_TIME_TO_SHOW,
        GAME_RESOLUTION_TILE_SIZE,
        GAME_RESOLUTION_TILE_OFFSET,
        GAME_GAMEPLAY_PLAYER_FIRE_EVATION
    } = Shared.Constants;

    const [epicenterRow, epicenterCol] = epicenter;
    const orientationDict = { 
        row: epicenterRow, 
        col: epicenterCol 
    };

    // сюда будем складывать пламя. добавляем эпицентер
    const blaze: IBlazeList[] = [{ 
        row: epicenterRow, 
        col: epicenterCol, 
        id: EntityNumbers.FIRE_CENTER 
    }];

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
                        destroyBoxFromMap(
                            map,
                            _direction.row, 
                            _direction.col,
                            decreaseBoxes
                        );
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

                    destroyBoxFromMap(
                        map, 
                        _direction.row, 
                        _direction.col,
                        decreaseBoxes
                    );

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
        const player = players[+color];
        const takes = getPlayerOccupiedCells(player);

        for (let { row, col } of takes) {
            for (let entity of map[row][col]) {
                if (
                    [
                        EntityNumbers.FIRE_CENTER,
                        EntityNumbers.FIRE_BOTTOM,
                        EntityNumbers.FIRE_LEFT,
                        EntityNumbers.FIRE_TOP,
                        EntityNumbers.FIRE_RIGHT,
                        EntityNumbers.FIRE_MIDDLE_X,
                        EntityNumbers.FIRE_MIDDLE_Y
                    ].includes(entity)
                ) {
                    // считаем расстояние между точками
                    const distance = Shared.Maths.getDistanceSqrt(
                        col * GAME_RESOLUTION_TILE_SIZE, // x1
                        player.x,                        // x2
                        row * GAME_RESOLUTION_TILE_SIZE, // y1
                        player.y                         // y2
                    );
              
                    const offset = GAME_RESOLUTION_TILE_OFFSET * 2;
                    if (GAME_RESOLUTION_TILE_SIZE - distance > offset + GAME_GAMEPLAY_PLAYER_FIRE_EVATION) {
                        tryToDamagePlayer(proxyState, +color);

                        debug(
                            "Player was damaged by fire",
                            `distance: ${GAME_RESOLUTION_TILE_SIZE - distance}`,
                            `[row, col]: ${[row, col]}`
                        );

                        break;
                    }

                    debug(
                        "Player is not damaged",
                        `distance: ${GAME_RESOLUTION_TILE_SIZE - distance}`,
                        `[row, col]: ${[row, col]}`
                    );
                }
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
 * или удаляет, в зависимости от переданного коллбэка.
 */
export const updateBlazeDependsCallback = (
    blaze: IBlazeList[],
    map: number[][][],
    callback: (
        entityId: number, 
        map: number[][][], 
        row: number, 
        col: number
    ) => void
) => {
    for (let fire of blaze) {
        callback(fire.id, map, fire.row, fire.col);
    }
};
