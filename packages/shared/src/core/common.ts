import * as Shared from "../idnex";

/**
 * Пытается передвинуть игрока, если были нажаты клавиши.
 * 
 * @param keys - нажатые клавиши
 * @returns двигать ли игрока: да или нет, в каком направлении
 */
export const tryToMovePlayer = (keys: number[]): [boolean, number] => {
    const { MoveDirections, InputKeys } = Shared.Enums;

    switch (true) {
        case keys.includes(InputKeys.INPUT_KEY_W):
            return [true, MoveDirections.UP];
        case keys.includes(InputKeys.INPUT_KEY_D):
            return [true, MoveDirections.RIGHT];
        case keys.includes(InputKeys.INPUT_KEY_S):
            return [true, MoveDirections.DOWN];
        case keys.includes(InputKeys.INPUT_KEY_A):
            return [true, MoveDirections.LEFT];
    }

    return [false, null];
};


/**
 * Пытается поставить бомбу, если были нажаты клавиши.
 * 
 * @param keys - нажатые клавиши
 * @param bombs - количество бомб
 * @returns ставить ли бомбу: да или нет
 */
export const tryToPlaceBomb = (keys: number[], bombs: number) => {
    const { INPUT_KEY_SPACE } = Shared.Enums.InputKeys;

    if (!keys.includes(INPUT_KEY_SPACE)) return false;
    if (bombs === 0) return false;

    return true;
};