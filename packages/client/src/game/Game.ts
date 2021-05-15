import { ClientChannel } from "@geckos.io/client";
import { Socket } from "socket.io-client";

export default class Game {
    private _ping: number;
    private _TCPChann: Socket;
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

    public init() {}

    public start() {}
}