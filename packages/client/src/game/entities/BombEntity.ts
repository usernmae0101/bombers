import BaseEntity from "../core/BaseEntity";

export default class BombEntity extends BaseEntity {
    constructor(frameX: number, frameY: number) {
        super(frameX, frameY);
    }

    public pulse() { }
}