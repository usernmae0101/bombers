import * as Shared from "@bombers/shared/src/idnex";
import PlayerFactory from "./PlayerFactory";

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

                const [isMove, direction] = Shared.Core.tryToMovePlayer(keys);
                if (isMove) {
                    Shared.Core.movePlayer(player, direction);
                    // check overlap
                    // check collision
                }

                const isPlace = Shared.Core.tryToPlaceBomb(keys, player.bombs);
                if (isPlace)
                    Shared.Core.placeBomb(this._state, +color);

                this._state.players[color].tick = tick;
            }
        }
    }

    public addPlayerToState(color: number) {
        this.state.players[color] = PlayerFactory.create(color); 
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
