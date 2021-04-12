// not good enough! must slide on the wall

import {
    GAME_RESOLUTION_HEIGHT,
    GAME_RESOLUTION_TILE_LENGTH_X,
    GAME_RESOLUTION_TILE_LENGTH_Y,
    GAME_RESOLUTION_TILE_SIZE,
    GAME_RESOLUTION_WIDTH
} from "./../idnex";
import { EntityNumbers } from "./../idnex";

const COLLIDING_ENTITIES = [
    EntityNumbers.BOX, EntityNumbers.ROCK,
    EntityNumbers.BOMB_BLUE, EntityNumbers.BOMB_RED,
    EntityNumbers.BOMB_YELLOW, EntityNumbers.BOMB_PURPLE
];

function align(position: number): number {
    return Math.round(position / GAME_RESOLUTION_TILE_SIZE) * GAME_RESOLUTION_TILE_SIZE;
}

interface IPlayer {
    x: number;
    y: number;
    r: number;
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

function hasDetectCollison(player: IPlayer, block: IBlock): boolean {
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

function isOverlapTop(x: number, y: number, map: number[][][]): boolean {
    if (y < 0) return true;

    const [tileXCeil, tileXFloor] = getCurrentTilePos(x);
    const [_, __, tileYRound] = getCurrentTilePos(y);

    for (let entity_id of COLLIDING_ENTITIES) {
        if (tileYRound === 0) return false;
        if (map[tileYRound - 1][tileXCeil].includes(entity_id)) {
            if (hasDetectCollison(getPlayerPos(x, y), getBlockPos(tileXCeil, tileYRound - 1))) return true;
        }
        if (map[tileYRound - 1][tileXFloor].includes(entity_id)) {
            if (hasDetectCollison(getPlayerPos(x, y), getBlockPos(tileXFloor, tileYRound - 1))) return true;
        }
    }

    return false;
}

function isOverlapBottom(x: number, y: number, map: number[][][]): boolean {
    if (y + GAME_RESOLUTION_TILE_SIZE > GAME_RESOLUTION_HEIGHT) return true;

    const [tileXCeil, tileXFloor] = getCurrentTilePos(x);
    const [_, __, tileYRound] = getCurrentTilePos(y);

    for (let entity_id of COLLIDING_ENTITIES) {
        if (tileYRound === GAME_RESOLUTION_TILE_LENGTH_Y - 1) return false;
        if (map[tileYRound + 1][tileXCeil].includes(entity_id)) {
            if (hasDetectCollison(getPlayerPos(x, y), getBlockPos(tileXCeil, tileYRound + 1))) return true;
        }
        if (map[tileYRound + 1][tileXFloor].includes(entity_id)) {
            if (hasDetectCollison(getPlayerPos(x, y), getBlockPos(tileXFloor, tileYRound + 1))) return true;
        }
    }

    return false;
}

function isOverlapRight(x: number, y: number, map: number[][][]): boolean {
    if (x + GAME_RESOLUTION_TILE_SIZE > GAME_RESOLUTION_WIDTH) return true;

    const [tileYCeil, tileYFloor] = getCurrentTilePos(y);
    const [_, __, tileXRound] = getCurrentTilePos(x);

    for (let entity_id of COLLIDING_ENTITIES) {
        if (tileXRound === GAME_RESOLUTION_TILE_LENGTH_X - 1) return false;
        if (map[tileYCeil][tileXRound + 1].includes(entity_id)) {
            if (hasDetectCollison(getPlayerPos(x, y), getBlockPos(tileXRound + 1, tileYCeil))) return true;
        }
        if (map[tileYFloor][tileXRound + 1].includes(entity_id)) {
            if (hasDetectCollison(getPlayerPos(x, y), getBlockPos(tileXRound + 1, tileYFloor))) return true;
        }
    }

    return false;
}

function isOverlapLeft(x: number, y: number, map: number[][][]): boolean {
    if (x < 0) return true;

    const [tileYCeil, tileYFloor] = getCurrentTilePos(y);
    const [_, __, tileXRound] = getCurrentTilePos(x);

    for (let entity_id of COLLIDING_ENTITIES) {
        if (tileXRound === 0) return false;
        if (map[tileYCeil][tileXRound - 1].includes(entity_id)) {
            if (hasDetectCollison(getPlayerPos(x, y), getBlockPos(tileXRound - 1, tileYCeil))) return true;
        }
        if (map[tileYFloor][tileXRound - 1].includes(entity_id)) {
            if (hasDetectCollison(getPlayerPos(x, y), getBlockPos(tileXRound - 1, tileYFloor))) return true;
        }
    }

    return false;
}

export function calculateTopCollision(x: number, y: number, map: number[][][]): number {
    if (isOverlapTop(x, y, map)) return align(y);
    return y;
}

export function calculateRightCollision(x: number, y: number, map: number[][][]): number {
    if (isOverlapRight(x, y, map)) return align(x);
    return x;
}

export function calculateBottomCollision(x: number, y: number, map: number[][][]): number {
    if (isOverlapBottom(x, y, map)) return align(y);
    return y;
}

export function calculateLeftCollision(x: number, y: number, map: number[][][]): number {
    if (isOverlapLeft(x, y, map)) return align(x);
    return x;
}