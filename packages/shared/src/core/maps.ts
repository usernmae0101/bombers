import * as Enums from "./../utils/enums";

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
                [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E],
                [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E],
                [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E],
                [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E],
                [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E],
                [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E],
                [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E],
                [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E],
                [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E],
                [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E],
                [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E], [E],
            ];
    }
}