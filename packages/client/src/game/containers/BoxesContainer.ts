import BaseContainer from "../core/BaseContainer";
import * as Shared from "@bombers/shared/src/idnex";
import BoxEntity from "../entities/BoxEntity";

export default class BoxesContainer extends BaseContainer<BoxEntity> {
    constructor () {
        super(
            Shared.Enums.ContainerLayers.BOXES,
            [Shared.Enums.EntityNumbers.BOX]
        );
    }

    public update(state: Shared.Interfaces.IGameState) {
        this.redraw(state.map);
    }
}