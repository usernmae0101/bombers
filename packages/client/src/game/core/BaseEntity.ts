import { BaseTexture, Texture } from "@pixi/core";
import { Rectangle } from "@pixi/math";
import { Sprite } from "@pixi/sprite";

import * as Shared from "@bombers/shared/src/idnex";

export default class BaseEntity extends Sprite {
    private _tick: number = 0;
    private _blinkedTimes: number = 0;

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

    get destroyed(): boolean {
        return this._destroyed;
    }

    get blinkedTimes(): number {
        return this._blinkedTimes;
    }

    /**
     * Устанавливает прозрачность игровой сущности
     * на период, заданный в игровых тактах, и меняет 
     * обратно на непрозрачность.
     * 
     * @param frequency - частота смены (в игровых тактах)
     * @param opacity - прозрачность (от 0.0 до 1.0)
     */
    public blink(frequency: number, opacity: number) {
        if (++this._tick < frequency) return;

        this.alpha = this.alpha === 1 ? opacity : 1;
        this._blinkedTimes++;
        this._tick = 0;
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