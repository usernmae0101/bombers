import { Rectangle } from "pixi.js";

import { GAME_RESOLUTION_TILE_SIZE, RESOURCE_IMAGE_PATH_TILEMAP } from "@bombers/shared/src/idnex";
import BaseEntity from "../core/BaseEntity";

export default class BombEntity extends BaseEntity {
    private _frame: number = 0;
    private _counter: number = 5;
    private _makeItBigger: boolean = true;

    constructor(frameX: number, frameY: number) {
        super(
            RESOURCE_IMAGE_PATH_TILEMAP,
            new Rectangle(frameX, frameY,
                GAME_RESOLUTION_TILE_SIZE,
                GAME_RESOLUTION_TILE_SIZE
            )
        );
    }

    tick() {
        if (++this._frame === this._counter) {
            const scale = this._makeItBigger ? 1.1 : 1;
            const anchor = this._makeItBigger ? 0.95 : 1;

            this.scale.set(scale);
            this.anchor.set(anchor);

            this._frame = 0;
            this._makeItBigger = !this._makeItBigger;
            this._counter -= 1;
        }
    }

    setPosition(row: number, col: number) {
        this.x = col * GAME_RESOLUTION_TILE_SIZE;
        this.y = row * GAME_RESOLUTION_TILE_SIZE;
    }
}