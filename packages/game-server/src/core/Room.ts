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
    private _slots: Shared.Interfaces.IGameSlots = Shared.Slots.slots;
    private _availableColors: Shared.Enums.PlayerColors[];
    private _users: Shared.Interfaces.IRoomUsers = {};
    private _socketManager: SocketManager;
    private _game: Game;

    constructor(socketManager: SocketManager, mapId: Shared.Enums.GameMaps) {
        this._socketManager = socketManager;
        this._mapId = mapId;
        this._game = new Game(Shared.Core.createMapById(mapId));
        this._setAvailableColors();
    }

    /**
     * Подключает пользователя к комнате.
     * 
     * @param token - авторизационный токен пользователя
     * @param userData - данные пользователя
     */
    public onJoin(token: string, userData: Shared.Interfaces.IUser) { 
        const color = this._chooseRandomColor();

        this._users[token] = { color };
        this._slots[color].user = userData;
        ++this._activeSlots;

        if (this._activeSlots === this._totalSlots)
            this._isLocked = true;

        // FIXME: передавать только изменение (подключенного пользователя) 
        this._socketManager.broadcastGameRoomSlots(this._slots);
    }

    public onLeave() { }

    public onReady() { }

    private _startGame() { }

    private _endGame() { }

    /**
     * Выбирает случайный цвет игрока из списка доступных. 
     * Удаляет выбранный цвет из списка.
     * 
     * @returns цвет игрока 
     */
    private _chooseRandomColor(): Shared.Enums.PlayerColors {
        const index = Math.floor(Math.random() * this._availableColors.length);
        const color = this._availableColors[index];

        this._availableColors.splice(index, 1);

        return color;
    }

    /**
     * Устанавливает доступные цвета игроков для комнаты.
     */
    private _setAvailableColors() {
        this._availableColors = [
            Shared.Enums.PlayerColors.BLUE,
            Shared.Enums.PlayerColors.PURPLE,
            Shared.Enums.PlayerColors.RED,
            Shared.Enums.PlayerColors.YELLOW
        ];
    }

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
     * Возвращает текущее состояние игровой комнаты для лобби.
     */
    get state(): Shared.Interfaces.IStateLobbyGameRoom {
        return {
            totalSlots: this._totalSlots,
            activeSlots: this._activeSlots,
            isLocked: this._isLocked,
            mapId: this._mapId
        };
    }
}