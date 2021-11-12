import BaseEntity from "../core/BaseEntity";
import * as Shared from "@bombers/shared/src/idnex";

export default class BombEntity extends BaseEntity {
    constructor(frameX: number, frameY: number) {
        super(frameX, frameY);
    }

    /**
     * Меняет размер и позицию бомбы, имитируя пульсацию.
     */
    public pulse(scale: number) {
        const offset = scale / 2;

        this.width = super.size + scale;
        this.x = super.positionX - offset;

        this.height = super.size + scale;
        this.y = super.positionY - offset;
    }
}
