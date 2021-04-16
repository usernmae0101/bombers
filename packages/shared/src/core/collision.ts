import {
    Cell,
    IOverlapData,
    GAME_RESOLUTION_HEIGHT,
    GAME_RESOLUTION_TILE_LENGTH_X,
    GAME_RESOLUTION_TILE_LENGTH_Y,
    GAME_RESOLUTION_TILE_SIZE,
    GAME_RESOLUTION_WIDTH,
    EntityNumbers, MoveDirections 
} from "./../idnex";

const COLLIDED_ENTITIES = [
    EntityNumbers.ROCK, EntityNumbers.BOX, EntityNumbers.BOMB_YELLOW,
    EntityNumbers.BOMB_BLUE, EntityNumbers.BOMB_RED, EntityNumbers.BOMB_PURPLE
];

export function align(position: number): number {
    return Math.round(position / GAME_RESOLUTION_TILE_SIZE) * GAME_RESOLUTION_TILE_SIZE;
}

export interface IPlayer {
    x: number;
    y: number;
    r?: number;
    direction?: number;
}

interface IBlock {
    x: number;
    y: number;
}

export function getCurrentTilePos(position: number): [number, number, number] {
    return [
        Math.ceil(position / GAME_RESOLUTION_TILE_SIZE),
        Math.floor(position / GAME_RESOLUTION_TILE_SIZE),
        Math.round(position / GAME_RESOLUTION_TILE_SIZE)
    ];
}

function getPlayerPos(x: number, y: number): IPlayer {
    return {
        r: GAME_RESOLUTION_TILE_SIZE / 2,
        x: x + GAME_RESOLUTION_TILE_SIZE / 2,
        y: y + GAME_RESOLUTION_TILE_SIZE / 2
    }
}

function getBlockPos(tileX: number, tileY: number): IBlock {
    return {
        x: (tileX * GAME_RESOLUTION_TILE_SIZE) + GAME_RESOLUTION_TILE_SIZE / 2,
        y: (tileY * GAME_RESOLUTION_TILE_SIZE) + GAME_RESOLUTION_TILE_SIZE / 2
    }
}

function hasDetectOverlap(player: IPlayer, block: IBlock): boolean {
    const playerDistanceX = Math.abs(player.x - block.x);
    const playerDistanceY = Math.abs(player.y - block.y);

    if (playerDistanceX > (GAME_RESOLUTION_TILE_SIZE / 2 + player.r)) return false;
    if (playerDistanceY > (GAME_RESOLUTION_TILE_SIZE / 2 + player.r)) return false;

    if (playerDistanceX <= (GAME_RESOLUTION_TILE_SIZE / 2)) return true;
    if (playerDistanceY <= (GAME_RESOLUTION_TILE_SIZE / 2)) return true;

    const cornerDistanceSq = Math.pow((playerDistanceX - GAME_RESOLUTION_TILE_SIZE / 2), 2) +
        (playerDistanceY - GAME_RESOLUTION_TILE_SIZE / 2) ^ 2;

    return (cornerDistanceSq <= Math.pow(player.r, 2));
}

function parseEntitiesFromMap(map: Cell[] | number[][][], row: number, col: number): number[] {
    if (map[0] instanceof Cell)
        return (map[row * GAME_RESOLUTION_TILE_LENGTH_X + col] as Cell).entinies.toArray();

    return (map as number[][][])[row][col];
}

/*
    Detection depends on the move direction and of the occupied space.
    ____________
   |_|_|_|_|_|_|
   |_|_|X|X|_|_|
   |_|_|XPX|_|_|
   |_|_|X|X|_|_|
   |_|_|_|_|_|_|
*/

export function detectOverlap(player: IPlayer, map: number[][][] | Cell[]): IOverlapData[] {
    let overlapData: IOverlapData[] = [];

    let tileXCeil, tileXFloor, tileYRound, _, __, tileYCeil, tileYFloor, tileXRound, isSameLine;

    if ([MoveDirections.DOWN, MoveDirections.UP].includes(player.direction)) {
        [tileXCeil, tileXFloor] = getCurrentTilePos(player.x);
        [_, __, tileYRound] = getCurrentTilePos(player.y);
        isSameLine = tileXCeil === tileXFloor;
    }

    if ([MoveDirections.LEFT, MoveDirections.RIGHT].includes(player.direction)) {
        [tileYCeil, tileYFloor] = getCurrentTilePos(player.y);
        [_, __, tileXRound] = getCurrentTilePos(player.x);
        isSameLine = tileYCeil === tileYFloor;
    }

    const playersPos = getPlayerPos(player.x, player.y);

    switch (player.direction) {
        case MoveDirections.UP: {
            // at the top border
            if (tileYRound === 0) return [];

            const row: number = tileYRound - 1;
            const colCeilEntities: number[] = parseEntitiesFromMap(map, row, tileXCeil);
            const colFloorEntities: number[] = parseEntitiesFromMap(map, row, tileXFloor);

            if (colCeilEntities.length && hasDetectOverlap(playersPos, getBlockPos(tileXCeil, row)))
                overlapData.push({ row, col: tileXCeil, entities: colCeilEntities });
            if (!isSameLine && colFloorEntities.length && hasDetectOverlap(playersPos, getBlockPos(tileXFloor, row)))
                overlapData.push({ row, col: tileXFloor, entities: colFloorEntities });
        }
            break;
        case MoveDirections.DOWN: {
            // at the bottom border
            if (tileYRound === GAME_RESOLUTION_TILE_LENGTH_Y - 1) return [];

            const row: number = tileYRound + 1;
            const colCeilEntities: number[] = parseEntitiesFromMap(map, row, tileXCeil);
            const colFloorEntities: number[] = parseEntitiesFromMap(map, row, tileXFloor);

            if (colCeilEntities.length && hasDetectOverlap(playersPos, getBlockPos(tileXCeil, row)))
                overlapData.push({ row, col: tileXCeil, entities: colCeilEntities });
            if (!isSameLine && colFloorEntities.length && hasDetectOverlap(playersPos, getBlockPos(tileXFloor, row)))
                overlapData.push({ row, col: tileXFloor, entities: colFloorEntities });
        }
            break
        case MoveDirections.LEFT: {
            // at the left border
            if (tileXRound === 0) return [];

            const col: number = tileXRound - 1;
            const rowCeilEntities: number[] = parseEntitiesFromMap(map, tileYCeil, col);
            const rowFloorEntities: number[] = parseEntitiesFromMap(map, tileYFloor, col);

            if (rowCeilEntities.length && hasDetectOverlap(playersPos, getBlockPos(col, tileYCeil)))
                overlapData.push({ row: tileYCeil, col, entities: rowCeilEntities });
            if (!isSameLine && rowFloorEntities.length && hasDetectOverlap(playersPos, getBlockPos(col, tileYFloor)))
                overlapData.push({ row: tileYFloor, col, entities: rowFloorEntities });
        }
            break;
        case MoveDirections.RIGHT: {
            // at the right border
            if (tileXRound === GAME_RESOLUTION_TILE_LENGTH_X - 1) return [];

            const col: number = tileXRound + 1;
            const rowCeilEntities: number[] = parseEntitiesFromMap(map, tileYCeil, col);
            const rowFloorEntities: number[] = parseEntitiesFromMap(map, tileYFloor, col);

            if (rowCeilEntities.length && hasDetectOverlap(playersPos, getBlockPos(col, tileYCeil)))
                overlapData.push({ row: tileYCeil, col, entities: rowCeilEntities });
            if (!isSameLine && rowFloorEntities.length && hasDetectOverlap(playersPos, getBlockPos(col, tileYFloor)))
                overlapData.push({ row: tileYFloor, col, entities: rowFloorEntities });
        }
    }

    return overlapData;
}

export function detectCollision(overlapData: IOverlapData[]): [boolean, number, number] {
    for (let {row, col, entities} of overlapData) {
        for (let entity_id of COLLIDED_ENTITIES) {
            if (entities.includes(entity_id))
                return [true, row, col];
        }
    }

    return [false, null, null];
}

export function isOutOfBorder(player: IPlayer): boolean {
    if (
        player.x < 0 ||
        player.x + GAME_RESOLUTION_TILE_SIZE > GAME_RESOLUTION_WIDTH ||
        player.y + GAME_RESOLUTION_TILE_SIZE > GAME_RESOLUTION_HEIGHT ||
        player.y < 0
    ) return true;

    return false;
}