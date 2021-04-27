import { Rectangle } from "pixi.js";

import { EntityNumbers, GAME_RESOLUTION_TILE_OFFSET, GAME_RESOLUTION_TILE_SIZE, RESOURCE_IMAGE_PATH_TILEMAP } from "@bombers/shared/src/idnex";
import BaseEntity from "../core/BaseEntity";

export default class FireEntity extends BaseEntity {
    readonly ID: number;

    constructor(frameX: number, frameY: number, id: number, angle?: number) {
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

        this.ID = id;
        if (angle !== undefined) this.angle = angle;
    }

    configurate() {
        // degree offset correction (edges)
        // stretch by X or Y (middle)
        switch (this.ID) {
            case EntityNumbers.FIRE_MIDDLE_Y:
                this.y -= GAME_RESOLUTION_TILE_OFFSET;
                this.height += GAME_RESOLUTION_TILE_OFFSET * 2;
                break;
            case EntityNumbers.FIRE_MIDDLE_X:
                this.x -= GAME_RESOLUTION_TILE_OFFSET;
                this.width += GAME_RESOLUTION_TILE_OFFSET * 2;
                break;
            case EntityNumbers.FIRE_RIGHT:
                this.x += GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET;
                this.height += GAME_RESOLUTION_TILE_OFFSET;
                break;
            case EntityNumbers.FIRE_BOTTOM:
                this.x += GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET;
                this.y += GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET;
                this.height += GAME_RESOLUTION_TILE_OFFSET * 2;
                break;
            case EntityNumbers.FIRE_LEFT:
                this.y += GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET;
                this.height += GAME_RESOLUTION_TILE_OFFSET * 2;
                break;
            case EntityNumbers.FIRE_TOP:
                this.height += GAME_RESOLUTION_TILE_OFFSET * 2;
        }
    }
}