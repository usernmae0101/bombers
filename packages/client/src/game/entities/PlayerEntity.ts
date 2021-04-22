import { Rectangle } from "@pixi/math";

import { EntityNumbers, GAME_RESOLUTION_TILE_OFFSET, GAME_RESOLUTION_TILE_SIZE, getEntityFrame, RESOURCE_IMAGE_PATH_TILEMAP } from "@bombers/shared/src/idnex";
import BaseEntity from "../core/BaseEntity";

export default class PlayerEntity extends BaseEntity {
    private _color: number;
    private _frame: Rectangle;

    constructor(color: number, frame: Rectangle) {
        super(
            RESOURCE_IMAGE_PATH_TILEMAP,
            frame,
            GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET,
            GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET
        ); 

        this._frame = frame;
        this._color = color;
    }

    get color(): number { return this._color; }

    setPosition(x: number, y: number) {
        this.x = x + GAME_RESOLUTION_TILE_OFFSET / 2;
        this.y = y + GAME_RESOLUTION_TILE_OFFSET / 2; 
    }

    setDirection(direction: number) {
        const { x: frameX, y: frameY } = getEntityFrame(EntityNumbers.PLAYER, this._color, direction);

        this._frame.x = frameX;
        this._frame.y = frameY;
        this.texture.updateUvs();
    }
}