import * as Shared from "./../idnex";

/**
 * Перемножет количество тайлов в ширину
 * на размер тайла в пикселях.
 * 
 * @returns ширина канваса в пикселях
 */
export const calculateCanvasWidth = (): number => {
    return Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_X * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
};

/**
 * Перемножет количество тайлов в высоту
 * на размер тайла в пикселях.
 * 
 * @returns высота канваса в пикселях
 */
 export const calculateCanvasHeight = (): number => {
    return Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_Y * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
};