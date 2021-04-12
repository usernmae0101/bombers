import { GAME_RESOLUTION_TILE_LENGTH_X, Cell, IGameStatePlayer, IPredictBuffer } from "../idnex";
import { GAME_STATE_BUFFER_CLIENT_MAX_SIZE } from "../utils/constants";
import { MoveDirections } from "../utils/enums";
import { IStateChanges } from "../utils/interfaces";

export function inverseMap(map: number[][][]): Cell[] {
    const _map = [];

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            _map.push(new Cell(map[row][col]));
        }
    }

    return _map;
}

export function normalizeMap(map: Cell[], width?: number): number[][][] {
    const _map = [];

    for (let cell = 0, row = []; cell < map.length; cell++) {
        row.push(map[cell].entinies.map(entity => entity));
        if (row.length === (width || GAME_RESOLUTION_TILE_LENGTH_X))
            _map.push(row) && (row = []);
    }

    return _map;
}

export function tryToMovePlayer(player: IGameStatePlayer): [boolean, "x" | "y", number] {
    if (!player.isMove) return [false, null, null];

    switch (player.direction) {
        case MoveDirections.UP:
            return [true, "y", -player.speed];
        case MoveDirections.RIGHT:
            return [true, "x", player.speed];
        case MoveDirections.DOWN:
            return [true, "y", player.speed];
        case MoveDirections.LEFT:
            return [true, "x", -player.speed];
    }
}

export function reconciliation(player: IGameStatePlayer, buffer: IPredictBuffer, tick: number, changes: IStateChanges) {    
    if (!buffer[tick]) {
        if (GAME_STATE_BUFFER_CLIENT_MAX_SIZE <= Object.keys(buffer).length)
            cleanPredictBuffer(buffer, tick);

        buffer[tick] = { isLate: true };
    }

    changes.y !== undefined && alignPlayer(buffer, "toY", player, tick, changes.y);
    changes.x !== undefined && alignPlayer(buffer, "toX", player, tick, changes.x);

    cleanPredictBuffer(buffer, tick);
}

function alignPlayer(buffer: IPredictBuffer, field: "toX" | "toY", player: IGameStatePlayer, tick: number, value: number) {    
    if (buffer[tick].isLate) {
        player[field] = value;
        return;
    }

    if (buffer[tick][field] !== value) {
        const max = Math.max(...Object.keys(buffer).map(key => +key));
        const difference = value - buffer[tick][field];

        for (let i = tick; i <= max; i++)
            (buffer[i][field] !== undefined) && (buffer[i][field] += difference);

        player[field] = buffer[max][field];
    }
}

function cleanPredictBuffer(buffer: IPredictBuffer, tick: number) {
    delete buffer[tick];

    const min = Math.min(...Object.keys(buffer).map(key => +key));

    if (min < tick)
        for (let i = min; i < tick; i++)
            delete buffer[i];
}