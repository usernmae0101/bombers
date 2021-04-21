import { EntityNumbers } from "./../idnex";

const B = [EntityNumbers.BOX];
const R = [EntityNumbers.ROCK];
const E = [] as number[];

export const default_map = [
    [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, R, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, R, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, R, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
    [B, B, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
    [E, E, B, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
    [E, E, B, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
];

export const getMapByRoomId = (room_id: number): number[][][] => {
    switch (room_id) {
        case 1: return default_map;
        case 2: return default_map;
    }
};
