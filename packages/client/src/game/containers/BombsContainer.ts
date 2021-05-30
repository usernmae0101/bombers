import BaseContainer from "../core/BaseContainer";
import * as Shared from "@bombers/shared/src/idnex";
import { BombEntity } from "../entities";

export default class BombsContainer extends BaseContainer<BombEntity> {
    constructor () {
        super(
            Shared.Enums.ContainerLayers.BOMBS,
            Shared.Helpers.getAllBombsIds()
        );
    }

    private _pulseBombs = (entityId: number, position: string) => {
        const bomb = this.entities[`${entityId}${position}`];
        bomb.pulse();
    };

    public update(state: Shared.Interfaces.IGameState) {
        this.redraw(
            state.map,
            [this._pulseBombs]
        );
    }
}