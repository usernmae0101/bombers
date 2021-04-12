import { ContainterLayers, EntityNumbers, IGameState } from "@bombers/shared/src/idnex";
import BaseContainer from "../core/BaseContainer";
import BoxEntity from "../entities/BoxEntity";

export default class BoxesContainer extends BaseContainer<BoxEntity> {
    constructor() {
        super(
            ContainterLayers.BOX,
            [EntityNumbers.BOX]
        );
    }

    update(state: IGameState) {
        this.updateMap(state.map);
    }
}