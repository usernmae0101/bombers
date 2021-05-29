import BaseEntity from "../core/BaseEntity";
import * as Shared from "@bombers/shared/src/idnex";

const { EntityNumbers } = Shared.Enums;
const { GAME_RESOLUTION_TILE_OFFSET, GAME_RESOLUTION_TILE_SIZE } = Shared.Constants;

export default class FireEntity extends BaseEntity {
    constructor(frameX: number, frameY: number) {
        super(frameX, frameY);
    }

    public configurate(entityId: number) {
        switch (entityId) {
            case EntityNumbers.FIRE_MIDDLE_Y:
                this.y -= GAME_RESOLUTION_TILE_OFFSET * 2;
                this.height += GAME_RESOLUTION_TILE_OFFSET * 4;
                break;
            case EntityNumbers.FIRE_MIDDLE_X:
                this.x -= GAME_RESOLUTION_TILE_OFFSET * 2;
                this.width += GAME_RESOLUTION_TILE_OFFSET * 4;
                break;
            case EntityNumbers.FIRE_RIGHT:
                this.rotate90degrees();
                this.height += GAME_RESOLUTION_TILE_OFFSET * 2;
                break;
            case EntityNumbers.FIRE_BOTTOM:
                this.rotate180degress();
                this.height += GAME_RESOLUTION_TILE_OFFSET * 2;
                break;
            case EntityNumbers.FIRE_LEFT:
                this.rotate270degrees();
                this.height += GAME_RESOLUTION_TILE_OFFSET * 2;
                break;
            case EntityNumbers.FIRE_TOP:
                this.height += GAME_RESOLUTION_TILE_OFFSET * 2;
        }
    }
}
