import * as Shared from "../idnex";

/**
 * Передвигает игрока. Устанавливает направление движения.
 * 
 * @param player - игрок
 * @param direction - направление движения
 */
export const movePlayer = (
    player: Shared.Interfaces.IGameStatePlayer,
    direction: Shared.Enums.MoveDirections
) => { 
    player.direction !== direction && (player.direction = direction);

    switch (direction) {
        case Shared.Enums.MoveDirections.UP:
            player.y -= player.speed;
            break;
        case Shared.Enums.MoveDirections.RIGHT:
            player.x += player.speed;
            break;
        case Shared.Enums.MoveDirections.DOWN:
            player.y += player.speed;
            break;
        case Shared.Enums.MoveDirections.LEFT:
            player.x -= player.speed;
    }
};

/**
 * Устанавливает бомбу.
 * 
 * @param state - игровое состояние
 * @param color - цвет игрока
 */
export const placeBomb = (
    state: Shared.Interfaces.IGameState,
    color: Shared.Enums.PlayerColors
) => {

};

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