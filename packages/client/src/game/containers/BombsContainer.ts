import BaseContainer from "../core/BaseContainer";
import * as Shared from "@bombers/shared/src/idnex";
import BoxEntity from "../entities/BoxEntity";

export default class BombsContainer extends BaseContainer<BoxEntity> {
    constructor () {
        super(
            Shared.Enums.ContainerLayers.BOMBS,
            Shared.Helpers.getAllBombsIds()
        );
    }

    public update(state: Shared.Interfaces.IGameState) {
        this.redraw(state.map);
    }
}