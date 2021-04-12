import { ContainterLayers, EntityNumbers, IGameState } from "@bombers/shared/src/idnex";
import BaseContainer from "../core/BaseContainer";
import FireEntity from "../entities/FireEntity";

export default class FiresContainer extends BaseContainer<FireEntity> {
    constructor() {
        super(
            ContainterLayers.FIRE,
            [
                EntityNumbers.FIRE_CENTER, EntityNumbers.FIRE_BOTTOM,
                EntityNumbers.FIRE_LEFT, EntityNumbers.FIRE_TOP, 
                EntityNumbers.FIRE_RIGHT
            ],
            EntityNumbers.FIRE_CENTER
        );
    }

    update(state: IGameState) {
        this.updateMap(state.map);
    }
}