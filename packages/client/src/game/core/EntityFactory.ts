import * as Shared from "@bombers/shared/src/idnex";
import * as Entities from "../entities/";
import { getEntityFrame } from "./frames";

export default class EntityFactory {
    /**
     * Создаёт игровую сущность по переданному идентификатору.
     * 
     * @param entityId - идентификатор игровой сущности
     * @returns игровая сущность
     */
    public static create(entityId: Shared.Enums.EntityNumbers): any {
        const { x: frameX, y: frameY } = getEntityFrame(entityId);

        switch (entityId) {
            case Shared.Enums.EntityNumbers.BOX:
                return new Entities.BoxEntity(frameX, frameY);
            case Shared.Enums.EntityNumbers.ROCK:
                return new Entities.RockEntity(frameX, frameY);
            case Shared.Enums.EntityNumbers.ARROW:
                return new Entities.ArrowEntity(frameX, frameY);
        }
    }
}