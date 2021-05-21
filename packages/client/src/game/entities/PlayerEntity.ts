import { Enums } from "@bombers/shared/src/idnex";
import BaseEntity from "../core/BaseEntity";
import { getEntityFrame } from "../core/frames";

const { EntityNumbers } = Enums;

export default class PlayerEntity extends BaseEntity {
    private _color: number;

    constructor(frameX: number, frameY: number, color: number) {
        super(frameX, frameY);

        this._color = color;
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Меняет фрейм игрока при смене направления движения.
     * 
     * @param direction - направление игрока
     */
    setDirection(direction: number) {
        const { x, y } = getEntityFrame(EntityNumbers.PLAYER, this._color, direction);

        this.texture.frame.x = x;
        this.texture.frame.y = y;
        this.texture.updateUvs();
    }
}
