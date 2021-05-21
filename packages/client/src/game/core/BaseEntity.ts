import { BaseTexture, Texture } from "@pixi/core";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";

import * as Shared from "@bombers/shared/src/idnex";

export default class BaseEntity extends Sprite {
    constructor(frameX: number, frameY: number) {
        super(
            new Texture(
                BaseTexture.from(Shared.Constants.GAME_RESOURCES_IMAGE_TILESET), 
                new Rectangle(
                    frameX,
                    frameY,
                    Shared.Constants.GAME_RESOLUTION_TILE_SIZE,
                    Shared.Constants.GAME_RESOLUTION_TILE_SIZE
                )
            )
        );
    }

    /**
     * Устанавливает коордитаны игровой сущности на канвасе.
     * 
     * @param row - ряд ячейки на игровой карте
     * @param col - колонка ячейки на игровой карте
     */
    public setPosition(row: number, col: number) {
        this.x = col * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
        this.y = row * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
    }
}