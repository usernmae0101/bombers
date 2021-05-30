import BaseContainer from "../core/BaseContainer";
import * as Shared from "@bombers/shared/src/idnex";
import { FireEntity } from "../entities";

const { EntityNumbers, ContainerLayers } = Shared.Enums;

export default class FiresContainer extends BaseContainer<FireEntity> {
    constructor() {
        super(
            ContainerLayers.FIRES,
            [
                EntityNumbers.FIRE_CENTER,
                EntityNumbers.FIRE_BOTTOM,
                EntityNumbers.FIRE_LEFT,
                EntityNumbers.FIRE_TOP,
                EntityNumbers.FIRE_RIGHT,
                EntityNumbers.FIRE_MIDDLE_X,
                EntityNumbers.FIRE_MIDDLE_Y
            ]
        );
    }

    public update(state: Shared.Interfaces.IGameState) {
        this.redraw(state.map);
    }
}
