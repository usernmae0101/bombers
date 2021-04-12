import { ContainterLayers, EntityNumbers, IGameState } from "@bombers/shared/src/idnex";
import BaseContainer from "../core/BaseContainer";
import ItemEntity from "../entities/ItemEntity";

export default class ItemsContainer extends BaseContainer<ItemEntity> {
    constructor() {
        super(
            ContainterLayers.ITEM,
            [
                EntityNumbers.ITEM_BOMB, EntityNumbers.ITEM_HEALTH,
                EntityNumbers.ITEM_RADIUS, EntityNumbers.ITEM_SPEED
            ]
        );
    }

    update(state: IGameState) {
        this.updateMap(state.map);
    }
}