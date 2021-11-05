import BaseContainer from "../core/BaseContainer";
import * as Shared from "@bombers/shared/src/idnex";
import { BombEntity } from "../entities";
import { debug } from "@bombers/shared/src/tools/debugger";

const { 
    GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT, 
    GAME_RESOLUTION_TILE_OFFSET 
} = Shared.Constants;

export default class BombsContainer extends BaseContainer<BombEntity> {
    private _timestampBombPlacing: { [key: string]: number; }; 
    private _tick: number;
    private _now: number;

    constructor () {
        super(
            Shared.Enums.ContainerLayers.BOMBS,
            Shared.Helpers.getAllBombsIds()
        );

        this._tick = 0;
        this._timestampBombPlacing = {};
    }

    /**
     * Коллбэк при добавлении бомбы на канвас.
     */
    private _onAdd = (position: string) => {
        this._timestampBombPlacing[position] = Date.now();
        
        debug(
            "Bomb has been added on the canvas",
            `position: ${position}`,
            `ts: ${this._timestampBombPlacing[position]}`
        );
    };

    /**
     * Коллбэк при удалении бомбы с канваса.
     */
    private _onDelete = (position: string) => {
        delete this._timestampBombPlacing[position];
    };

    /**
     * Пульсация бомбы по синусоиде. Период высчитывается
     * от оставшегося времени, амплитуда постоянная.
     */
    private _pulseBomb = (
        entityId: number, 
        position: string
    ) => {
        const bomb = this.entities[`${entityId}${position}`];
        
        const t1 = this._now - this._timestampBombPlacing[position];
        const t2 = GAME_GAMEPLAY_BOMB_DETONATE_TIMEOUT;
    
        const period = Math.ceil((t1 / t2) * 3) * (2 * Math.PI);
        const amplitude = GAME_RESOLUTION_TILE_OFFSET;

        const scale = amplitude * Math.sin(
            (t1 / 700) * period
        );

        bomb.pulse(scale);
    };

    public update(state: Shared.Interfaces.IGameState) {
        this._now = Date.now();

        this.redraw(
            state.map,
            [this._pulseBomb],
            this._onAdd,
            this._onDelete
        );
        
        this._tick++;
    }
}
