import { BaseTexture, Texture } from "@pixi/core";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";

import * as Shared from "@bombers/shared/src/idnex";

export default class BaseEntity extends Sprite {
    constructor(resource: string, frame: Rectangle) {
        super(
            new Texture(
                BaseTexture.from(resource), 
                frame
            )
        );
    }

    public setPosition(row: number, col: number) {
        this.x = col * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
        this.y = row * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
    }
}