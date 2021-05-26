import * as Shared from "@bombers/shared/src/idnex";
import * as Entities from "../entities/";
import { getEntityFrame } from "./frames";

const { EntityNumbers } = Shared.Enums;

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
            case EntityNumbers.BOX:
                return new Entities.BoxEntity(frameX, frameY);
            case EntityNumbers.ROCK:
                return new Entities.RockEntity(frameX, frameY);
            case EntityNumbers.ARROW:
                return new Entities.ArrowEntity(frameX, frameY);
            case EntityNumbers.BOMB_BLUE:
            case EntityNumbers.BOMB_YELLOW:
            case EntityNumbers.BOMB_PURPLE:
            case EntityNumbers.BOMB_RED:
                return new Entities.BombEntity(frameX, frameY);;
        }
    }
}