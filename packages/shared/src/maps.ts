import * as Enums from "./utils/enums";

/** Коробка. */
const B = [Enums.EntityNumbers.BOX];
/** Камень. */
const R = [Enums.EntityNumbers.ROCK];
/** Пустая клетка. */
const E = [] as number[];

/**
 * Создаёт игровую карту по переданному идентификатору.
 * 
 * @param mapId - идентификатор карты
 * @returns карта
 */
export const createMapById = (mapId: Enums.GameMaps): number[][][] => {
    switch (mapId) {
        case Enums.GameMaps.MAP_1:
            return [
                [E, B, E, B, E, B, E, B, E, B, E, B, E, B, E, B, E],
                [E, E, B, E, B, E, B, E, B, E, B, E, B, E, B, E, E],
                [R, B, R, R, R, B, R, B, R, B, R, B, R, R, R, B, R],
                [B, E, R, E, B, E, B, E, B, E, B, E, B, E, R, E, B],
                [R, B, R, B, R, B, R, B, R, B, R, B, R, B, R, B, R], 
                [B, E, B, E, B, E, B, E, B, E, B, E, B, E, B, E, B], 
                [R, B, R, B, R, B, R, B, R, B, R, B, R, B, R, B, R],
                [B, E, B, E, B, E, B, E, B, E, B, E, B, E, B, E, B],
                [R, B, R, B, R, B, R, B, R, B, R, B, R, B, R, B, R],
                [E, E, B, E, B, E, B, E, B, E, B, E, B, E, B, E, E],
                [E, B, E, B, E, B, E, B, E, B, E, B, E, B, E, B, E],
            ];
        case Enums.GameMaps.MAP_2:
            return [
                [E, E, E, R, E, E, E, E, E, E, E, E, E, E, E, E, E],
                [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
                [E, E, E, E, E, E, B, E, E, E, E, E, E, E, E, E, E],
                [E, E, E, B, E, E, E, E, E, E, E, E, E, E, E, E, E],
                [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
                [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
                [E, E, E, E, E, E, E, E, R, E, E, E, E, E, E, E, E],
                [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
                [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
                [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
                [E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E, E],
            ];
    }
}
