import BaseContainer from "../core/BaseContainer";
import RockEntity from "../entities/RockEntity";
import * as Shared from "@bombers/shared/src/idnex";

export default class RocksContainer extends BaseContainer<RockEntity> {
    constructor () {
        super(
            Shared.Enums.ContainerLayers.ROCKS,
            [Shared.Enums.EntityNumbers.ROCK]
        );
    }

    public update(state: Shared.Interfaces.IGameState) {
        this.redraw(state.map);
    }
}