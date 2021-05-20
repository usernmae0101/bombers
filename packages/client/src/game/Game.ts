import { ClientChannel } from "@geckos.io/client";
import { Socket } from "socket.io-client";
import { Application } from "pixi.js";

import * as Shared from "@bombers/shared/src/idnex";
import Renderer from "./core/Renderer";
import * as Containers from "./containers/";

export default class Game {
    private _tick: number = 0;
    /** Соединение с игровым сервером по TCP. */
    private _TCPChann: Socket;
    /** Соединение с игровым сервером по UDP. */
    private _UDPChann: ClientChannel;
    /** Цвет локального игрока. */
    private _color: Shared.Enums.PlayerColors;
    /** Игровое состояние. */
    private _state: Shared.Interfaces.IGameState;
    private _app: Application;
    private _renderer: Renderer;

    constructor() {
        this._app = new Application({
            width: Shared.Common.calculateCanvasWidth(),
            height: Shared.Common.calculateCanvasHeight(),
            backgroundAlpha: 0
        });

        this._renderer = new Renderer([
            new Containers.BoxesContainer,
            new Containers.RocksContainer
        ]);

        // подгружаем игровые ресурсы
        this._app.loader.add([Shared.Constants.GAME_RESOURCES_IMAGE_TILESET]);
    }

    set TCPChann(value: Socket) {
        this._TCPChann = value;
    }

    set UDPChann(value: ClientChannel) {
        this._UDPChann = value;
    }

    /**
     * Устанавлвает игровое состояние.
     */
    set state(value: Shared.Interfaces.IGameState) {
        this._state = value;
    }

    /**
     * Устанавливает цвет локального игрока.
     */
    set color(value: Shared.Enums.PlayerColors) {
        this._color = value;
    }

    public start() {
        document.getElementById(Shared.Constants.GAME_CANVAS_VIEW_ID).appendChild(this._app.view);

        this._renderer.init(this._app.stage);

        setInterval(() => this._update(), 1000 / Shared.Constants.GAME_CLIENT_UPDATE_RATE);
        
        this._app.ticker.add(() => {
            this._renderer.render(this._state);
        });
    }

    private _update() {
        this._tick++;
    }
}
