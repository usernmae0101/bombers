import * as Shared from "@bombers/shared/src/idnex";
import PlayerFactory from "./PlayerFactory";

interface IKeysBuffer {
    [color: number]: Shared.Interfaces.IKeysData[];
}

export default class Game {
    /** Игровое состояние. */
    private _state: Shared.Interfaces.IGameState;
    /** Cтатус игры: начата или нет. */
    private _isStarted: boolean = false;
    private _proxyState: Shared.Interfaces.IGameState;
    private _bombsState: Shared.Interfaces.IBombsState;
    public keysBuffer: IKeysBuffer = {};

    private _updatePlayers() {
        for (let color in this._proxyState.players) {
            if (this.keysBuffer[color].length) {
                const { keys, tick } = this.keysBuffer[color].shift();

                const player = this._proxyState.players[color];

                const [isMove, direction] = Shared.Core.tryToMovePlayer(keys);
                if (isMove) {
                    const _player = { ...player };

                    const overlapData = Shared.Core.movePlayer(_player, direction, this._state.map);
                    if (overlapData) {
                        // перебираем пересечённые игровые сущности
                        Shared.Core.filterOverlapData(overlapData, this._proxyState, +color, this._bombsState);
                    } 

                    player.x = _player.x;
                    player.y = _player.y;
                    player.direction = _player.direction;
                }

                const isPlaceBomb = Shared.Core.tryToPlaceBomb(keys, this._state, this._bombsState, +color);
                if (isPlaceBomb) {
                    Shared.Core.placeBombToMap(this._proxyState, this._bombsState, +color);
                }

                this._proxyState.players[color].tick = tick;
            }
        }
    }

    /**
     * Добавляет игрока в игровое состояние.
     * 
     * @param color - цвет игрока
     */
    public addPlayerToState(color: number) {
        this._proxyState.players[color] = PlayerFactory.create(color);
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
     * Устанавливет состояние бомб для игроков.
     */
    set bombsState(value: Shared.Interfaces.IBombsState) {
        this._bombsState = value;
    }

    /**
     * Устанавливает прокси-объект игрового состояния.
     */
    set proxyState(value: Shared.Interfaces.IGameState) {
        this._proxyState = value;
    }

    /**
     * Возвращает игровое состояние.
     */
    get state(): Shared.Interfaces.IGameState {
        return this._state;
    }
}
