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
    private _boxes: number;
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
                +color,
                this._decreaseBoxes
            );
        }
    }

    /**
     * Добавляет игрока в игровое состояние.
     */
    public addPlayerToState(color: number) {
        this._state.players[color] = PlayerFactory.create(color);
    }

    /**
     * Удаляет игрока из состояния, когда он вышел из комнаты.
     */
    public removePlayerFromState(color: number) {
        // добавляем в очередь, чтобы не получить ошибку
        if (this._isStarted) {
            this._queuePlayersToRemove.push(color);
            return;
        }

        delete this._proxyState.players[color];
    }

    /**
     * Обновляет эмоцию игрока в игровом состоянии.
     */
    public updatePlayerEmotion(color: number, emotion: number) {
        debug(
            "Emotion has been changed",
            `color: ${color}`,
            `emotion: ${emotion}`
        );

        this._state.players[color].emotion = emotion;
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

        // удаляем игроков, которые удалены не в основном цикле
        for (let color; (color = this._queuePlayersToRemove.shift()) !== undefined;) {
            delete this._proxyState.players[color];

            debug(
                "Player in queue has been removed",
                `color: ${color}`
            );
        }
    }

    /**
     * Увеличивает количество коробок на карте при подсчёте.
     */
    public increaseBoxes() {
        ++this._boxes;

        debug(
            "Increases the counter of boxes",
            `boxes: ${this._boxes}`
        );
    }

    /**
     * Уменьшает счетчик коробок. Если коробки кончились, запускает стену.
     */
    private _decreaseBoxes = () => {
        if(--this._boxes === 0) {
            this._proxyState.wall = Date.now();

            debug(
                "Starts wall cuz of the boxes are out",
                `timestamp: ${this._state.wall}`
            );
            
            this._startWall();
        }
    };

    /**
     * Ежесекундно добавляет cтену в ячейку, пока не заполнит все ячейки
     * на карте. Удаляет игрока, если он находится в области ячейки.
     *
     * Перебираем двумерный массив M*N по часовой стрелке от периферии 
     * к центру. 
     *
     *            A
     *            |
     *       M    *
     *       -----------
     *     N |>|>|>|>|v|
     *       |>|>|>|v|v|
     * D---* |^|>|>|v|v| *---B
     *       |^|<|<|<|v|
     *       |<|<|<|<|<|
     *       -----------     
     *           *    
     *           |   
     *           C
     */
    private async _startWall() {
        const M = Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_X;
        const N = Shared.Constants.GAME_RESOLUTION_TILE_LENGTH_Y;

        let margin = 0, cell = 0;
        
        let row = 0;
        let col = 0;

        while (cell++ < N * M) {
            // если в ячейке на карте нет камня
            if (!this._state.map[row][col].includes(Shared.Enums.EntityNumbers.ROCK)) {
                Shared.Common.addEntityToMap(
                    Shared.Enums.EntityNumbers.ROCK,
                    this._proxyState.map,
                    row,
                    col
                );  

                for (let color in this._state.players) {
                    const takes = Shared.Common.getPlayerOccupiedCells(
                        this._state.players[+color]
                    );

                    for (let { row: tRow, col: tCol } of takes) {
                        if (
                            row === tRow && 
                            col === tCol
                        ) {
                            debug(
                                "Player has been destroyed by wall",
                                `color: ${color}`
                            );
                           
                            this._queuePlayersToRemove.push(+color);
                        }
                    }
                }
            }

            // движемся вправо (вдоль A)
            if (row === margin && col < M - margin - 1)
                ++col;

            // движемся вниз (вдоль B)
            else if (col === M - margin - 1 && row < N - margin - 1)
                ++row;

            // дввижемся влево (вдоль C)
            else if (row === N - margin - 1 && col > margin)
                --col;

            // движемся вверх (вдоль D)
            else 
                --row;

            if ((row === margin + 1) && (col === margin) && (margin !== M - margin - 1))
                ++margin;

            await new Promise(res => setTimeout(res, 1000));
        }
    }

    /**
     * Устанавливает количество коробок на карте.
     */
    set boxes(value: number) {
        this._boxes = value;
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
