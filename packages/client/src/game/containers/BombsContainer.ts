import { ContainterLayers, EntityNumbers, IGameState } from "@bombers/shared/src/idnex";
import BaseContainer from "../core/BaseContainer";
import BombEntity from "../entities/BombEntity";

export default class BombsContainer extends BaseContainer<BombEntity> {
    constructor() {
        super(
            ContainterLayers.BOMB,
            [
                EntityNumbers.BOMB_BLUE, EntityNumbers.BOMB_RED,
                EntityNumbers.BOMB_YELLOW, EntityNumbers.BOMB_PURPLE
            ]
        );
    }

    private _tickBomb(entity: BombEntity): boolean {
        return false;
    }

    update(state: IGameState) {
        this.updateMap(state.map, [this._tickBomb]);
    }
}