import BaseContainer from "../core/BaseContainer";
import * as Shared from "@bombers/shared/src/idnex";
import { ItemEntity } from "../entities";

const { EntityNumbers } = Shared.Enums;

export default class ItemsContainer extends BaseContainer<ItemEntity> {
    constructor() {
        super(
            Shared.Enums.ContainerLayers.ITEMS,
            [
                EntityNumbers.ITEM_BOMB,
                EntityNumbers.ITEM_HEALTH,
                EntityNumbers.ITEM_RADIUS,
                EntityNumbers.ITEM_SPEED
            ]
        );
    }

    public update(state: Shared.Interfaces.IGameState) {
        this.redraw(state.map);
    }
}