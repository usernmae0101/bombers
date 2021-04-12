import { ContainterLayers, EntityNumbers, IGameState } from "@bombers/shared/src/idnex";
import BaseContainer from "../core/BaseContainer";
import CraterEntity from "../entities/CraterEntity";

export default class CratersContainer extends BaseContainer<CraterEntity> {
    constructor() {
        super(
            ContainterLayers.CRATER,
            [EntityNumbers.CRATER]
        );
    }

    update(state: IGameState) {
        this.updateMap(state.map);
    }
}