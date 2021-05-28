import BaseEntity from "../core/BaseEntity";
import * as Shared from "@bombers/shared/src/idnex";

const {  GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

export default class CraterEntity extends BaseEntity {
    constructor(frameX: number, frameY: number) {
        super(frameX, frameY);
    }

    setPosition(row: number, col: number) {
        this.x = col * GAME_RESOLUTION_TILE_SIZE;
        this.y = row * GAME_RESOLUTION_TILE_SIZE;
    }
}