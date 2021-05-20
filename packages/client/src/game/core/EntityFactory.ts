import * as Shared from "@bombers/shared/src/idnex";
import BoxEntity from "../entities/BoxEntity";
import RockEntity from "../entities/RockEntity";

export default class EntityFactory {
    public static create(entityId: Shared.Enums.EntityNumbers): any {
        const frameX = 15, frameY = 20;

        switch (entityId) {
            case Shared.Enums.EntityNumbers.BOX:
                return new BoxEntity(frameX, frameY);
            case Shared.Enums.EntityNumbers.ROCK:
                return new RockEntity(frameX, frameY);
        }
    }
}