import * as Shared from "@bombers/shared/src/idnex";
import { createState } from "./game-state";

export default class Game {
    /** Игровое состояние. */
    private _state: Shared.Interfaces.IGameState;

    constructor(map: number[][][]) {
        this._state = createState(map);
    }

    get state(): Shared.Interfaces.IGameState {
        return this._state;
    }
}