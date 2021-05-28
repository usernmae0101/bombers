import * as Shared from "@bombers/shared/src/idnex";

const { EntityNumbers } = Shared.Enums;

/**
 * Проверяет, вышел ли игрок за границу канваса.
 * 
 * @param player - игрок
 * @returns вышел ли за границу: да или нет
 */
export function isOutOfBorder(player: Shared.Interfaces.IGameStatePlayer): boolean {
    const { GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

    if (
        player.x < 0 ||
        player.x + GAME_RESOLUTION_TILE_SIZE > Shared.Helpers.calculateCanvasWidth() ||
        player.y + GAME_RESOLUTION_TILE_SIZE > Shared.Helpers.calculateCanvasHeight() ||
        player.y < 0
    ) return true;

    return false;
};

/**
 * Проверяет, находится ли в ячейке идентификатор 
 * игровой сущности, с которой игрок сталкивается.
 * 
 * @param cellEintites - список идентификаторов сущностей в ячейке
 * @returns столкнулся ли игрок с чем-то: да или нет
 */
export const isPlayerCollide = (cellEintites: number[]): boolean => {
    for (let entityId of cellEintites) {
        if (
            // идентификаторы игровых сущностей, с которыми игрок сталкивается
            [
                EntityNumbers.BOMB_BLUE,
                EntityNumbers.BOMB_PURPLE,
                EntityNumbers.BOMB_YELLOW,
                EntityNumbers.BOMB_RED,
                EntityNumbers.BOX,
                EntityNumbers.ROCK
            ].includes(entityId)) return true;
    }

    return false;
};