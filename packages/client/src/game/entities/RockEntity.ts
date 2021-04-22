import { Rectangle } from "pixi.js";

import { GAME_RESOLUTION_TILE_OFFSET, GAME_RESOLUTION_TILE_SIZE, RESOURCE_IMAGE_PATH_TILEMAP } from "@bombers/shared/src/idnex";
import BaseEntity from "../core/BaseEntity";

export default class RockEntity extends BaseEntity {
    constructor(frameX: number, frameY: number) {
        super(
            RESOURCE_IMAGE_PATH_TILEMAP,
            new Rectangle(frameX, frameY, 
                GAME_RESOLUTION_TILE_SIZE, 
                GAME_RESOLUTION_TILE_SIZE
            ),
            GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET,
            GAME_RESOLUTION_TILE_SIZE - GAME_RESOLUTION_TILE_OFFSET
        );
    }
}