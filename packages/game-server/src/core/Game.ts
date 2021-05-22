import * as Shared from "@bombers/shared/src/idnex";

export default class Game {
    /** Игровое состояние. */
    private _state: Shared.Interfaces.IGameState;
    /** Cтатус игры: начата или нет. */
    private _isStarted: boolean = false;
    public keysBuffer: { [color: number]: Shared.Interfaces.IKeysData[] } = {};

    private _updatePlayers() {
        for (let color in this.state.players) {
            if (this.keysBuffer[color].length) {
                const { keys, tick } = this.keysBuffer[color].shift();

                const player = this._state.players[color];

                

                this._state.players[color].tick = tick;
            }
        }
    }

    /**
     * Обновляет игровое состояние.
     */
    public update() {
        this._updatePlayers();
    }

    /** 
     * Устанавливает игровое состояние.
     */
    set state(value: Shared.Interfaces.IGameState) {
        this._state = value;
    }

    /**
     * Устанавливает статус игры: начата или нет.
     */
    set isStarted(value: boolean) {
        this._isStarted = value;
    }

    /**
     * Возвращает статус игры: начата или нет.
     */
    get isStarted(): boolean {
        return this._isStarted;
    }

    /**
     * Возвращает игровое состояние.
     */
    get state(): Shared.Interfaces.IGameState {
        return this._state;
    }
}
