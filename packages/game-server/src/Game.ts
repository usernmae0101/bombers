import * as Shared from "@bombers/shared/src/idnex";
import PlayerFactory from "./PlayerFactory";
import { debug } from "@bombers/shared/src/tools/debugger";

interface IKeysBuffer {
    [color: number]: Shared.Interfaces.IKeysData[];
}

export default class Game {
    /** Игровое состояние. */
    private _state: Shared.Interfaces.IGameState;
    /** Cтатус игры: начата или нет. */
    private _isStarted: boolean = false;
    private _proxyState: Shared.Interfaces.IGameState;
    private _queuePlayersToRemove: number[] = [];
    private _bombsState: Shared.Interfaces.IBombsState;
    public keysBuffer: IKeysBuffer = {};

    private _updatePlayer(
        keys: number[], 
        tick: number, 
        color: string
    ) {
        // если пакет пришел с опозданием
        if (tick < this._state.players[+color].tick)
            return;

        const [isPlayerMove, direction] = Shared.Common.tryToMovePlayer(keys);
        if (isPlayerMove) {
            const _player = { ...this._state.players[+color] };

            const overlapData = Shared.Common.movePlayer(
                _player, 
                direction, 
                this._state.map
            );
            if (overlapData) {
                // перебираем пересечённые игровые сущности
                Shared.Common.filterOverlapData(
                    overlapData, 
                    this._proxyState, 
                    +color, 
                    this._bombsState
                );
                        
                // если игрок был удалён из игрового сосояния
                if (!(color in this._state.players))
                    return;
            } 

            this._proxyState.players[+color].x = _player.x;
            this._proxyState.players[+color].y = _player.y;
            this._proxyState.players[+color].direction = _player.direction;
            this._proxyState.players[+color].tick = tick;
        }

        const isPlaceBomb = Shared.Common.tryToPlaceBomb(
            keys, 
            this._state, 
            this._bombsState, 
            +color
        );
        if (isPlaceBomb) {
            Shared.Explode.placeBombToMap(
                this._proxyState, 
                this._bombsState, 
                +color
            );
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

    public removePlayerFromState(color: number) {
        // добавляем в очередь, чтобы не получить ошибку
        if (this._isStarted) {
            this._queuePlayersToRemove.push(color);
            return;
        }

        delete this._proxyState.players[color];
    }

    public updatePlayerEmotion(color: number, emotion: number) {
        debug(
            "Emotion has been changed",
            `color: ${color}`,
            `emotion: ${emotion}`
        );

        this._proxyState.players[color].emotion = emotion;
    }

    /**
     * Обновляет игровое состояние.
     */
    public update() {
        for (let color in this._proxyState.players) {
            if (this.keysBuffer[color].length) {
                const { keys, tick } = this.keysBuffer[color].shift();
                
                this._updatePlayer(keys, tick, color);
            }
        }

        // удаляем игроков, которые отключились
        for (let color of this._queuePlayersToRemove)
            delete this._proxyState.players[color];
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
