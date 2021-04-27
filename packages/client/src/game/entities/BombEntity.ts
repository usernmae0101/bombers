import { Rectangle } from "pixi.js";

import { GAME_RESOLUTION_TILE_OFFSET, GAME_RESOLUTION_TILE_SIZE, RESOURCE_IMAGE_PATH_TILEMAP } from "@bombers/shared/src/idnex";
import BaseEntity from "../core/BaseEntity";

export default class BombEntity extends BaseEntity {
    private _frame: number = 0;
    private _counter: number = 45;
    private _makeItBigger: boolean = true;

    constructor(frameX: number, frameY: number) {
        super(
            RESOURCE_IMAGE_PATH_TILEMAP,
            new Rectangle(
                frameX, 
                frameY,
                GAME_RESOLUTION_TILE_SIZE,
                GAME_RESOLUTION_TILE_SIZE
            ),
            GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET,
            GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET
        );
    }

    tick() {
        if (++this._frame > this._counter) {
            const scale = GAME_RESOLUTION_TILE_OFFSET;

            this.width += this._makeItBigger ? scale : -scale;
            this.x += this._makeItBigger ? -(scale / 2): (scale / 2);

            this.height += this._makeItBigger ? scale : -scale;
            this.y += this._makeItBigger ? -(scale / 2): (scale / 2);

            this._frame = 0;
            this._makeItBigger = !this._makeItBigger;
            this._counter -= 5;
        }
    }
}