import { GAME_RESOLUTION_TILE_OFFSET, GAME_RESOLUTION_TILE_SIZE } from "@bombers/shared/src/idnex";
import { BaseTexture, Rectangle, Sprite, Texture } from "pixi.js";

export default abstract class BaseEntity extends Sprite {
    constructor (resource: string, frame?: Rectangle, width?: number, height?: number) {
        super(
            new Texture(
                BaseTexture.from(resource),
                frame
            )
        );

        if (width !== undefined) this.width = width;
        if (height !== undefined) this.height = height;
    }
    
    setPosition(row: number, col: number) {
        this.x = (col * GAME_RESOLUTION_TILE_SIZE) + GAME_RESOLUTION_TILE_OFFSET / 2;
        this.y = (row * GAME_RESOLUTION_TILE_SIZE) + GAME_RESOLUTION_TILE_OFFSET / 2;
    }

    configurate(): void {};
}