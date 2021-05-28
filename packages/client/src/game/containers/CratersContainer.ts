import BaseContainer from "../core/BaseContainer";
import * as Shared from "@bombers/shared/src/idnex";
import { CraterEntity } from "../entities";

const { EntityNumbers } = Shared.Enums;

export default class CratersContainer extends BaseContainer<CraterEntity> {
    constructor() {
        super(
            Shared.Enums.ContainerLayers.CRATERS,
            [EntityNumbers.CRATER]
        );
    }

    public update(state: Shared.Interfaces.IGameState) {
        this.redraw(state.map);
    }
}