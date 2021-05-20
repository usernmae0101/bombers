import { Rectangle } from "@pixi/math";

import BaseEntity from "../core/BaseEntity";
import * as Shared from "@bombers/shared/src/idnex";

export default class RockEntity extends BaseEntity {
    constructor(frameX: number, frameY: number) {
        super(
            Shared.Constants.GAME_RESOURCES_IMAGE_TILESET,
            new Rectangle(
                frameX,
                frameY,
                Shared.Constants.GAME_RESOLUTION_TILE_SIZE,
                Shared.Constants.GAME_RESOLUTION_TILE_SIZE
            )
        );
    }
}