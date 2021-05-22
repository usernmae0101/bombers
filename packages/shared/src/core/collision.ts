import * as Shared from "@bombers/shared/src/idnex";

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