import { EntityNumbers, getEntityFrame } from "@bombers/shared/src/idnex";
import ArrowEntity from "../entities/ArrowEntity";
import BombEntity from "../entities/BombEntity";
import BoxEntity from "../entities/BoxEntity";
import CraterEntity from "../entities/CraterEntity";
import FireEntity from "../entities/FireEntity";
import ItemEntity from "../entities/ItemEntity";
import RockEntity from "../entities/RockEntity";

export default class EntityFactory {
    static create(entity_id: number): any {
        const { x: frameX, y: frameY } = getEntityFrame(entity_id);

        switch (entity_id) {
            case EntityNumbers.BOX:
                return new BoxEntity(frameX, frameY);
            case EntityNumbers.ROCK:
                return new RockEntity(frameX, frameY);
            case EntityNumbers.CRATER:
                return new CraterEntity(frameX, frameY);
            case EntityNumbers.FIRE_RIGHT:
                return new FireEntity(frameX, frameY, entity_id, 90);
            case EntityNumbers.FIRE_BOTTOM:
                return new FireEntity(frameX, frameY, entity_id, 180);
            case EntityNumbers.FIRE_LEFT:
                return new FireEntity(frameX, frameY, entity_id, 270);
            case EntityNumbers.FIRE_CENTER:
                return new FireEntity(frameX, frameY, entity_id);
            case EntityNumbers.FIRE_MIDDLE_Y:
                return new FireEntity(frameX, frameY, entity_id);
            case EntityNumbers.FIRE_MIDDLE_X:
                return new FireEntity(frameX, frameY, entity_id);
            case EntityNumbers.FIRE_TOP:
                return new FireEntity(frameX, frameY, entity_id);
            case EntityNumbers.BOMB_BLUE:
                return new BombEntity(frameX, frameY);
            case EntityNumbers.ARROW:
                return new ArrowEntity(frameX, frameY);
            case EntityNumbers.BOMB_YELLOW:
                return new BombEntity(frameX, frameY);
            case EntityNumbers.BOMB_PURPLE:
                return new BombEntity(frameX, frameY);
            case EntityNumbers.BOMB_RED:
                return new BombEntity(frameX, frameY);;
            case EntityNumbers.ITEM_HEALTH:
                return new ItemEntity(frameX, frameY);
            case EntityNumbers.ITEM_SPEED:
                return new ItemEntity(frameX, frameY);
            case EntityNumbers.ITEM_RADIUS:
                return new ItemEntity(frameX, frameY);
            case EntityNumbers.ITEM_BOMB:
                return new ItemEntity(frameX, frameY);
        }
    }
}