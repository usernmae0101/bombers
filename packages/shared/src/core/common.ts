import * as Shared from "../idnex";

/**
 * Передвигает игрока. Если направление движения поменялось,
 * обновляет направление и выравнивает игрока по оси обратной его движению: 
 * если движется по Y - выравнивает по X, а если движется по X - выравнивает по Y.
 * 
 * @param player - игрок
 * @param direction - направление движения
 */
export const movePlayer = (
    player: Shared.Interfaces.IGameStatePlayer,
    direction: Shared.Enums.MoveDirections
) => {
    const { UP, LEFT, RIGHT, DOWN } = Shared.Enums.MoveDirections;

    if (player.direction !== direction) {
        if ([UP, DOWN].includes(direction))
            alignPlayer(player, "x");

        if ([LEFT, RIGHT].includes(direction))
            alignPlayer(player, "y");

        player.direction = direction;
    }
    
    // TODO: добавить формулу
    switch (direction) {
        case UP:
            player.y -= player.speed;
            break;
        case RIGHT:
            player.x += player.speed;
            break;
        case DOWN:
            player.y += player.speed;
            break;
        case LEFT:
            player.x -= player.speed;
    }
};

/**
 * Выравнивает игрока в клетке, большую часть которой он занимает.
 * 
 * @param player - игрок
 * @param axis - по какой оси выравнивать (x или y)
 */
export const alignPlayer = (
    player: Shared.Interfaces.IGameStatePlayer,
    axis: "x" | "y"
) => {
    const { GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

    player[axis] = Math.round(player[axis] / GAME_RESOLUTION_TILE_SIZE) * GAME_RESOLUTION_TILE_SIZE;
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
