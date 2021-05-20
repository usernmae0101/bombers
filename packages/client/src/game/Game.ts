import { ClientChannel } from "@geckos.io/client";
import { Socket } from "socket.io-client";
import { Application } from "pixi.js";

import * as Shared from "@bombers/shared/src/idnex";

export default class Game {
    private _ping: number;
    /** Соединение с игровым сервером по TCP. */
    private _TCPChann: Socket;
    /** Соединение с игровым сервером по UDP. */
    private _UDPChann: ClientChannel;
    /** Цвет локального игрока. */
    private _color: Shared.Enums.PlayerColors;
    /** Игровое состояние. */
    private _state: Shared.Interfaces.IGameState;
    private _app: Application;

    constructor() {
        this._app = new Application({
            width: Shared.Common.calculateCanvasWidth(),
            height: Shared.Common.calculateCanvasHeight()
        });
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

    set ping(value: number) {
        this._ping = value;
    }

    public start() {
        alert("started")
    }

    private _update() {
        
    }
}
