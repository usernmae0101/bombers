import BaseContainer from "../core/BaseContainer";
import * as Shared from "@bombers/shared/src/idnex";
import { BombEntity } from "../entities";
import { debug } from "@bombers/shared/src/tools/debugger";

const { 
    GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT, 
    GAME_RESOLUTION_TILE_OFFSET 
} = Shared.Constants;

export default class BombsContainer extends BaseContainer<BombEntity> {
    private _timestampBombPlacing: { [key: string]: number; } = {}; 
    private _tick: number = 0;

    constructor () {
        super(
            Shared.Enums.ContainerLayers.BOMBS,
            Shared.Helpers.getAllBombsIds()
        );
    }

    private _onAdd = (position: string) => {
        debug(
            "Bomb has been added on the canvas",
            `position: ${position}`
        );

        this._timestampBombPlacing[position] = Date.now();
    };

    private _onDelete = (position: string) => {
        delete this._timestampBombPlacing[position];
    };

    private _pulseBomb = (entityId: number, position: string) => {
        const bomb = this.entities[`${entityId}${position}`];
        const ratio = (Date.now() - this._timestampBombPlacing[position]) / GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT;
        const scale = Shared.Maths.lerp(1, GAME_RESOLUTION_TILE_OFFSET, Math.min(ratio, 1));  

        debug(
            "Scale of bomb has been changed",
            `ratio: ${ratio}`,
            `scale: ${scale}`,
            `position: ${position}`
        );

        bomb.pulse(scale, this._tick);
    };

    public update(state: Shared.Interfaces.IGameState) {
        this.redraw(
            state.map,
            [this._pulseBomb],
            this._onAdd,
            this._onDelete
        );
        
        this._tick++;
    }
}
