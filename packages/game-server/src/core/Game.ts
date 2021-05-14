import * as Shared from "@bombers/shared/src/idnex";

export default class Game {
    private _state: Shared.Interfaces.IGameState;

    set state(value: Shared.Interfaces.IGameState) {
        this._state = value;
    }
}