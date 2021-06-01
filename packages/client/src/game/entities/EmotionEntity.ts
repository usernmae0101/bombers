import BaseEntity from "../core/BaseEntity";

export default class EmotionEntity extends BaseEntity {
    constructor(frameX: number, frameY: number) {
        super(frameX, frameY, false);
    }
}