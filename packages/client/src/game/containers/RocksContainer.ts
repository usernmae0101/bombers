import { ContainterLayers, EntityNumbers, IGameState } from "@bombers/shared/src/idnex";
import BaseContainer from "../core/BaseContainer";
import RockEntity from "../entities/RockEntity";

export default class RocksContainer extends BaseContainer<RockEntity> {
    constructor() {
        super(
            ContainterLayers.ROCK,
            [EntityNumbers.ROCK]
        );
    }

    update(state: IGameState) {
        this.updateMap(state.map);
    }
}