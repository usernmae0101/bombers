import Game from "./Game";
import * as Shared from "@bombers/shared/src/idnex";
import SocketManager from "../sockets/SocketManager";

export default class Room {
    /** Общее количество игровых слотов. */
    readonly totalSlots = 4;
    
    /** Количество занятых игровых слотов. */
    private _activeSlots: number = 0;
    /** Статус комнаты: открыта или закрыта. */
    private _isLocked: boolean = false;
    /** Идентификатор игровой карты. */
    private _mapId: Shared.Enums.GameMaps;
    private _socketManager: SocketManager;
    private _game: Game;

    constructor(socketManager: SocketManager, mapId: Shared.Enums.GameMaps) {
        this._socketManager = socketManager;
        this._mapId = mapId;
        this._game = new Game;
    }

    public onJoin() { }

    public onLeave() { }

    public onReady() { }

    private _startGame() { }

    private _endGame() { }

    /**
     * Возвращает текущее состояние игровой комнаты.
     */
    get state(): Shared.Interfaces.IGameRoom {
        return {
            totalSlots: this.totalSlots,
            activeSlots: this._activeSlots,
            isLocked: this._isLocked,
            mapId: this._mapId
        };
    }
}