import { ClientChannel } from "@geckos.io/client";
import { Socket } from "socket.io-client";

export default class Game {
    private _ping: number;
    /** Соединение с игровым сервером по TCP. */
    private _TCPChann: Socket;
    /** Соединение с игровым сервером по UDP. */
    private _UDPChann: ClientChannel;

    set TCPChann (value: Socket) {
        this._TCPChann = value;
    }

    set UDPChann (value: ClientChannel) {
        this._UDPChann = value;
    }

    set ping(value: number) {
        this._ping = value;
    }

    public start() {}
}