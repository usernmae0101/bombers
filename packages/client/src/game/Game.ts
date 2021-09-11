import { ClientChannel } from "@geckos.io/client";
import { Application } from "pixi.js";
import { Dispatch } from "redux";

import * as GameActions from "../ui/redux/actions/game-actions";
import * as Shared from "@bombers/shared/src/idnex";
import Renderer from "./core/Renderer";
import * as Containers from "./containers/";
import Keyboard from "./core/Keyboard";

interface IPredctionBuffer {
    [tick: number]: {
        /** Нажатые пользователем клавиши. */
        keys: number[];
        /** Позиция игрока на канвасе по X. */
        x: number;
        /** Позиция игрока на канвасе по Y. */
        y: number;
    }
}

interface ISnapshot {
    /** ВременнАя метка получения изменений. */
    timestamp: number;
    /** Изменения, полученные с сервера. */
    snapshot: Shared.Interfaces.INotReliableStateData;
}

interface ISnapshotBuffer {
    [color: string]: ISnapshot[];
}

export default class Game {
    private _tick: number = 0;
    /** Соединение с игровым сервером по UDP. */
    private _UDPChann: ClientChannel;
    /** Цвет локального игрока. */
    private _color: Shared.Enums.PlayerColors;
    /** Игровое состояние. */
    private _state: Shared.Interfaces.IGameState;
    private _app: Application;
    private _predictionBuffer: IPredctionBuffer = {};
    private _snapshotBuffer: ISnapshotBuffer = {};
    private _keys: Shared.Enums.InputKeys[] = [];
    private _renderer: Renderer;

    constructor() {
        this._app = new Application({
            width: Shared.Helpers.calculateCanvasWidth(),
            height: Shared.Helpers.calculateCanvasHeight(),
            backgroundAlpha: 0
        });

        this._renderer = new Renderer([
            new Containers.CratersContainer,
            new Containers.ItemsContainer,
            new Containers.FiresContainer,
            new Containers.PlayersContainer,
            new Containers.BombsContainer,
            new Containers.BoxesContainer,
            new Containers.RocksContainer
        ]);

        // подгружаем игровые ресурсы
        this._app.loader.add([Shared.Constants.GAME_RESOURCES_IMAGE_TILESET]);
    }

    set UDPChann(value: ClientChannel) {
        this._UDPChann = value;
    }

    set state(value: Shared.Interfaces.IGameState) {
        this._state = value;
    }

    /**
     * Устанавливает цвет локального игрока.
     */
    set color(value: Shared.Enums.PlayerColors) {
        this._color = value;
    }

    private _handleInputs() {
        switch (true) {
            case Keyboard.keys["KeyW"]:
            case Keyboard.keys["ArrowUp"]:
                this._keys.push(Shared.Enums.InputKeys.INPUT_KEY_W);
                break;
            case Keyboard.keys["KeyD"]:
            case Keyboard.keys["ArrowRight"]:
                this._keys.push(Shared.Enums.InputKeys.INPUT_KEY_D);
                break;
            case Keyboard.keys["KeyS"]:
            case Keyboard.keys["ArrowDown"]:
                this._keys.push(Shared.Enums.InputKeys.INPUT_KEY_S);
                break;
            case Keyboard.keys["KeyA"]:
            case Keyboard.keys["ArrowLeft"]:
                this._keys.push(Shared.Enums.InputKeys.INPUT_KEY_A);
        }

        if (Keyboard.keys["Space"] && !Keyboard.locked["Space"]) {
            this._keys.push(Shared.Enums.InputKeys.INPUT_KEY_SPACE);
            
            // чтобы не реaгировать на кнопку при зажатии
            Keyboard.locked["Space"] = true;
        }
    }

    private _sendInputKeysToServer() {
        if (this._keys.length) {
            this._UDPChann.emit(
                String(Shared.Enums.SocketChannels.GAME_ON_SEND_INPUT_KEYS),
                {
                    keys: this._keys,
                    tick: this._tick
                }
            );
        }
    }

    public onReliableStateChanges(changes: any[], dispatch: Dispatch) {
        for (let _changes of changes) {
            // удалён игрок из игрового состояния
            if ("delete" in _changes)
                delete this._state.players[_changes.delete];
           
            // поменялась карта
            else if ("row" in _changes)
                this._state.map[_changes.row][_changes.col] = _changes.entities;
            
            // поменялись хар-ки игрока или добавлен игрок
            else {
                if (_changes.color === "players") {
                    this._state.players[_changes.key] = _changes.value;
                    continue;
                }

                const player = this._state.players[_changes.color];

                if (+_changes.color === this._color) {
                    if (_changes.key === "bombs")
                        dispatch(
                            GameActions.action_game_set_bombs(_changes.value)
                        );
                    else if (_changes.key === "speed")
                        dispatch(
                            GameActions.action_game_set_speed(_changes.value)
                        );
                    else if (_changes.key === "radius")
                        dispatch(
                            GameActions.action_game_set_radius(_changes.value)
                        );
                }

                // @ts-ignore 
                player[_changes.key] = _changes.value;
            }
        }
    }

    private _interpolateEnemies() {
        const renderTime = Date.now() - (1000 / Shared.Constants.GAME_SERVER_BROADCAST_RATE);

        for (let color in this._snapshotBuffer) {
            const enemy = this._state.players[+color];
            const buffer = this._snapshotBuffer[color];

            // FIXME: удалить все снимки
            if (!enemy) continue;

            if (buffer.length > 1 && buffer[0].timestamp <= renderTime && renderTime <= buffer[1].timestamp) {
                const [s1, s2] = buffer;

                const ratio = (renderTime - s1.timestamp) / (s2.timestamp - s1.timestamp);

                enemy.direction = buffer[1].snapshot.direction;
                
                // FIXME: проверить дистанцию?
                enemy.x = Shared.Maths.lerp(s1.snapshot.x, s2.snapshot.x, ratio);
                enemy.y = Shared.Maths.lerp(s1.snapshot.y, s2.snapshot.y, ratio);
            }

            else {
                while (buffer.length > 1 && buffer[1].timestamp <= renderTime)
                    buffer.shift();

                if (buffer.length === 1) {
                    enemy.direction = buffer[0].snapshot.direction;

                    enemy.x = buffer[0].snapshot.x;
                    enemy.y = buffer[0].snapshot.y;
                }
            }
        }
    }

    public onNotReliableStateChanges(changes: Shared.Interfaces.INotReliableStateChanges) {
        for (let color in changes) {
            // для локального игрока выполняем согласование с сервером
            if (+color === this._color) {
                this._serverReconciliation(changes[color]);
                continue;
            }

            const enemy = this._state.players[+color];
            const { x: currentX, y: currentY, } = enemy;

            if (!(color in this._snapshotBuffer))
                this._snapshotBuffer[color] = [];

            // сохраняем снимок для остальных игроков
            this._snapshotBuffer[color].push({
                timestamp: Date.now(),
                snapshot: {
                    ...changes[color],
                    direction: changes[color].direction ?? enemy.direction,
                    x: changes[color].x ?? currentX,
                    y: changes[color].y ?? currentY
                }
            });
        }
    }

    private _serverReconciliation(changes: Shared.Interfaces.INotReliableStateData) {
        if (!changes.tick) 
            return;

        for (let tick in this._predictionBuffer) {
            if (+tick < changes.tick) {
                delete this._predictionBuffer[tick];
                continue;
            }

            if (+tick === changes.tick) {
                const { x: predictedX, y: predictedY } = this._predictionBuffer[tick];
                
                const authX = changes.x ?? predictedX;
                const authY = changes.y ?? predictedY;

                if (authX === predictedX && authY === predictedY)
                    break;
                
                this._state.players[this._color].x = authX;
                this._state.players[this._color].y = authY;
            }

            this._updateLocalPlayer(this._predictionBuffer[tick].keys, false);
        }
    }

    private _updateLocalPlayer(keys: number[], isInsertPrediction: boolean) {
        const player = this._state.players[this._color];

        const [isPlayerMove, direction] = Shared.Common.tryToMovePlayer(keys);
        if (isPlayerMove) {
            const _player = { ...player };

            Shared.Common.movePlayer(_player, direction, this._state.map);

            player.x = _player.x;
            player.y = _player.y;
            player.direction = _player.direction;

            // FIXME: ограничить буфер?
            if (isInsertPrediction) {
                this._predictionBuffer[this._tick] = {
                    x: _player.x,
                    y: _player.y,
                    keys
                };
            }
        }
    }

    public start() {
        document.getElementById(Shared.Constants.GAME_CANVAS_VIEW_ID)
            .appendChild(this._app.view);

        this._renderer.init(this._app.stage);

        let accumulator = 0;

        this._app.ticker.add(() => {
            let frameTime = this._app.ticker.elapsedMS > Shared.Constants.GAME_MAXIMUM_DELTA_TIME 
                ? Shared.Constants.GAME_MAXIMUM_DELTA_TIME
                : this._app.ticker.elapsedMS; 
            
            accumulator += frameTime;

            while (accumulator >= Shared.Constants.GAME_FIXED_DELTA_TIME) {
               this._update();
               accumulator -= Shared.Constants.GAME_FIXED_DELTA_TIME;
            }

            const ratio = accumulator / Shared.Constants.GAME_FIXED_DELTA_TIME;
        
            this._interpolateEnemies();
            this._renderer.render(ratio, this._state, this._color);
        });
    }

    private _update() {
        // если локального игрока больше нет в состоянии
        if (!(this._color in this._state.players))
            return;

        this._handleInputs();
        this._sendInputKeysToServer();
        this._updateLocalPlayer(this._keys, true);

        this._keys = [];

        this._tick++;
    }
}
