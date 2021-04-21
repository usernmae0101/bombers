import { GAME_RESOLUTION_TILE_LENGTH_X, Cell, IGameStatePlayer, IPredictBuffer, isOutOfBorder, align, detectOverlap } from "../idnex";
import { GAME_STATE_BUFFER_CLIENT_MAX_SIZE } from "../utils/constants";
import { InputKeys, MoveDirections } from "../utils/enums";
import { IOverlapData, IStateChanges } from "../utils/interfaces";
import { detectCollision } from "./collision";
import { ArraySchema } from "@colyseus/schema";

/*
    Converts map from [row][col][entities] to [Cell.entities];
*/

export function inverseMap(map: number[][][]): Cell[] {
    const _map = [];

    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            _map.push(new Cell(map[row][col]));
        }
    }

    return _map;
}

/*
    Converts map from [Cell.entities] to [row][col][entities];
*/

export function normalizeMap(map: Cell[], width?: number): number[][][] {
    const _map = [];

    for (let cell = 0, row = []; cell < map.length; cell++) {
        row.push(map[cell].entinies.map(entity => entity));
        if (row.length === (width || GAME_RESOLUTION_TILE_LENGTH_X))
            _map.push(row) && (row = []);
    }

    return _map;
}

function tryToSetDirection(player: IGameStatePlayer, direction: number): void {
    if (player.direction !== direction) player.direction = direction;
}

export function tryToMovePlayer(player: IGameStatePlayer, keys: number[]): [boolean, "x" | "y", number] {
    switch (true) {
        case keys.includes(InputKeys.INPUT_KEY_W):
            tryToSetDirection(player, MoveDirections.UP);
            return [true, "y", -player.speed * 2];
        case keys.includes(InputKeys.INPUT_KEY_D):
            tryToSetDirection(player, MoveDirections.RIGHT);
            return [true, "x", player.speed * 2];
        case keys.includes(InputKeys.INPUT_KEY_S):
            tryToSetDirection(player, MoveDirections.DOWN);
            return [true, "y", player.speed * 2];
        case keys.includes(InputKeys.INPUT_KEY_A):
            tryToSetDirection(player, MoveDirections.LEFT);
            return [true, "x", -player.speed * 2];
    }

    return [false, null, null];
}

export function reconciliation(player: IGameStatePlayer, buffer: IPredictBuffer, tick: number, changes: IStateChanges) {    
    if (!buffer[tick]) {
        if (GAME_STATE_BUFFER_CLIENT_MAX_SIZE <= Object.keys(buffer).length)
            clearPredictBuffer(buffer, tick);

        return;
    }

    changes.y !== undefined && alignPlayer(buffer, "toY", player, tick, changes.y);
    changes.x !== undefined && alignPlayer(buffer, "toX", player, tick, changes.x);

    clearPredictBuffer(buffer, tick);
}

function alignPlayer(buffer: IPredictBuffer, field: "toX" | "toY", player: IGameStatePlayer, tick: number, value: number) {    
    if (buffer[tick][field] !== value) {
        const max = Math.max(...Object.keys(buffer).map(key => +key));
        const difference = value - buffer[tick][field];

        for (let i = tick; i <= max; i++) {
            // not good
            (buffer[i][field] !== undefined) && (buffer[i][field] += difference);
        }

        player[field] = buffer[max][field];
    }
}

/*
    Updates map object to trigger the Proxy trap "set".
*/

export function updateCellOnTheMap(map: ArraySchema<Cell>, indexOfCell: number, entity_id: number, action: "add" | "remove", doCheckDubs?: boolean) {
    const entities = map[indexOfCell].entinies.toArray();

    if (action === "add") {
        if (doCheckDubs && entities.includes(entity_id)) return;
        entities.push(entity_id);
    }

    if (action === "remove") {
        const entitityIndex = entities.findIndex(id => id === entity_id);
        entities.splice(entitityIndex, 1);
    }

    map[indexOfCell] = new Cell(entities);
}

export function filterOverlap(player: IGameStatePlayer, overlapData: IOverlapData[], map: Cell[]) {
    for (let { row, col, entities } of overlapData) {
        for (let entity_id of entities) {
            switch(entity_id) {

            }
        }
    }
}

export function movePlayer(player: IGameStatePlayer, field: "x"| "y", offset: number, map: number[][][] | Cell[]): IOverlapData[] | undefined {
    const _player = { x: player.x, y: player.y, direction: player.direction };

    _player[field] += offset;
    
    if (isOutOfBorder(_player)) {
        player[field] = align(_player[field]);
        return;
    } 
    
    const overlapData: IOverlapData[] = detectOverlap(_player, map);
    if (overlapData.length) {
        const [isCollide, row, col] = detectCollision(overlapData);
        if (isCollide) {
            player[field] = align(_player[field]);
            // sliding?
            return;
        }
    }

    player[field] = _player[field];

    return overlapData;
}

/*
    Clrears all client-side predictions to the current tick.
*/

function clearPredictBuffer(buffer: IPredictBuffer, tick: number) {
    delete buffer[tick];

    const min = Math.min(...Object.keys(buffer).map(key => +key));

    if (min < tick)
        for (let i = min; i < tick; i++)
            delete buffer[i];
}
