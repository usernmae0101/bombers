import BaseEntity from "../core/BaseEntity";
import * as Shared from "@bombers/shared/src/idnex";

export default class BombEntity extends BaseEntity {
    constructor(frameX: number, frameY: number) {
        super(frameX, frameY);
    }

    public pulse(scale: number) {
        const offset = scale / 2;

        this.width += scale;
        this.x -= offset;

        this.height += scale;
        this.y -= offset;
    }
}
