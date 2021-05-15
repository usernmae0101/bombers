import Game from "./Game";
import * as Shared from "@bombers/shared/src/idnex";
import SocketManager from "../sockets/SocketManager";

export default class Room {
    /** Общее количество игровых слотов. */
    private readonly _totalSlots = 4;
    /** Количество занятых игровых слотов. */
    private _activeSlots: number = 0;
    /** Статус комнаты: открыта или закрыта. */
    private _isLocked: boolean = false;
    /** Идентификатор игровой карты. */
    private _mapId: Shared.Enums.GameMaps;
    /** Игровые слоты. */
    private _slots: Shared.Interfaces.IGameSlots;
    private _users: Shared.Interfaces.IRoomUsers = {};
    private _socketManager: SocketManager;
    private _game: Game;

    constructor(socketManager: SocketManager, mapId: Shared.Enums.GameMaps) {
        this._socketManager = socketManager;
        this._mapId = mapId;
        this._game = new Game(Shared.Core.createMapById(mapId));
    }

    public onJoin(token: string) { 

    }

    public onLeave() { }

    public onReady() { }

    private _startGame() { }

    private _endGame() { }

    /**
     * Возвращает текущее игровое состояние.
     */
    get gameState(): Shared.Interfaces.IGameState {
        return this._game.state;
    }

    /** 
     * Возвращает статус комнаты: открыта или закрыта. 
     */
    get isLocked(): boolean {
        return this._isLocked;
    }

    /**
     * Возвращает состояние игровых слотов.
     */
    get slots(): Shared.Interfaces.IGameSlots {
        return this._slots;
    }

    /**
     * Возвращает подключенных к комнате пользователей.
     */
    get users(): Shared.Interfaces.IRoomUsers {
        return this._users;
    } 

    /**
     * Возвращает текущее состояние игровой комнаты.
     */
    get state(): Shared.Interfaces.IGameRoom {
        return {
            totalSlots: this._totalSlots,
            activeSlots: this._activeSlots,
            isLocked: this._isLocked,
            mapId: this._mapId
        };
    }
}