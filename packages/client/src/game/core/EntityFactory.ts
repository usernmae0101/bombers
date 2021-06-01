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
                return new Entities.BombEntity(frameX, frameY);
            case EntityNumbers.FIRE_CENTER:
            case EntityNumbers.FIRE_BOTTOM:
            case EntityNumbers.FIRE_LEFT:
            case EntityNumbers.FIRE_TOP:
            case EntityNumbers.FIRE_RIGHT:
            case EntityNumbers.FIRE_MIDDLE_X:
            case EntityNumbers.FIRE_MIDDLE_Y:
                return new Entities.FireEntity(frameX, frameY);
            case EntityNumbers.ITEM_BOMB:
            case EntityNumbers.ITEM_HEALTH:
            case EntityNumbers.ITEM_SPEED:
            case EntityNumbers.ITEM_RADIUS:
                return new Entities.ItemEntity(frameX, frameY);
            case EntityNumbers.CRATER:
                return new Entities.CraterEntity(frameX, frameY);
            case EntityNumbers.EMOTION_1_FRONT:
            case EntityNumbers.EMOTION_2_FRONT:
            case EntityNumbers.EMOTION_3_FRONT:
            case EntityNumbers.EMOTION_4_FRONT:
                return new Entities.EmotionEntity(frameX, frameY);
        }
    }
}