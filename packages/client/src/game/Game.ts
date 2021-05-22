import { ClientChannel } from "@geckos.io/client";
import { Application } from "pixi.js";

import * as Shared from "@bombers/shared/src/idnex";
import Renderer from "./core/Renderer";
import * as Containers from "./containers/";
import Keyboard from "./core/Keyboard";

interface IPredcionBuffer {
    [tick: number]: {
        /** Нажатые клавиши. */
        keys: number[];
        /** Позиция на канвасе по X. */
        x: number;
        /** Позиция на канвасе по Y. */
        y: number;
    }
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
    private _predictionBuffer: IPredcionBuffer = {};
    private _keys: Shared.Enums.InputKeys[] = [];
    private _renderer: Renderer;

    constructor() {
        this._app = new Application({
            width: Shared.Helpers.calculateCanvasWidth(),
            height: Shared.Helpers.calculateCanvasHeight(),
            backgroundAlpha: 0
        });

        this._renderer = new Renderer([
            new Containers.PlayersContainer,
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
                break;
            case Keyboard.keys["Space"]:
                if (!Keyboard.locked["Space"]) {
                    this._keys.push(Shared.Enums.InputKeys.INPUT_KEY_SPACE);

                    Keyboard.locked["Space"] = true;
                }
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
            )
        }
    }

    // TODO:
    public onReliableStateChanges(changes: any[]) {

    }

    // TODO:
    public onNotReliableStateChanges(changes: Shared.Interfaces.INotReliableStateChanges) {
        
    }

    // TODO:
    private _serverReconciliation() {
        
    }

    private _updateLocalPlayer() {
        const player = this._state.players[this._color];

        const [isMove, direction] = Shared.Core.tryToMovePlayer(this._keys);
        if (isMove) {
            Shared.Core.movePlayer(player, direction);
            // check overlap
            // check collision

            // FIXME: ограничить буфер
            this._predictionBuffer[this._tick] = {
                keys: this._keys,
                x: player.x,
                y: player.y
            };
        }
    }

    public start() {
        document.getElementById(Shared.Constants.GAME_CANVAS_VIEW_ID).appendChild(this._app.view);

        this._renderer.init(this._app.stage);

        // считываение клавиш
        setInterval(() => this._update(), 1000 / Shared.Constants.GAME_CLIENT_UPDATE_RATE);

        // отрисовака
        this._app.ticker.add(() => {
            this._renderer.render(this._state);
        });
    }

    private _update() {
        this._handleInputs();
        this._sendInputKeysToServer();
        this._updateLocalPlayer();

        this._keys = [];

        this._tick++;
    }
}
