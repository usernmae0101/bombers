import Game from "./Game";
import * as Shared from "@bombers/shared/src/idnex";
import SocketManager from "../sockets/SocketManager";
import { createState } from "./game-state";
import { createMapById } from "@bombers/shared/src/core";

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
    /** Количество готовых к игре пользователей. */
    private _readyCounter: number = 0;
    private _users: Shared.Interfaces.IRoomUsers = {};
    private _socketManager: SocketManager;
    private _updateInterval: NodeJS.Timeout = null;
    private _game: Game;

    constructor(socketManager: SocketManager, mapId: Shared.Enums.GameMaps) {
        this._socketManager = socketManager;
        this._mapId = mapId;
        this._game = new Game;

        this._configurate();
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

    public onLeave() {

    }

    /**
     * Меняет статус готовности пользователя к игре.
     * 
     * @param token - токен пользователя
     */
    public onReady(token: string) {
        this._slots[this._users[token].color].isReady = true;

        if (++this._readyCounter > 1 && !this._game.isStarted)
            this._startGame();

        // FIXME: передавать только изменение (статус готовности) 
        this._socketManager.broadcastGameRoomSlots(this._slots);
    }

    /**
     * Запускает игру, начинает обновлять игровое состояние.
     */
    private _startGame() {
        this._game.isStarted = true;

        this._updateInterval = setInterval(() => {
            this._game.update();
        }, 1000 / Shared.Constants.GAME_SERVER_TICK_RATE);

        this._socketManager.serverSocketTCP.of("battle").to("room").emit(
            String(Shared.Enums.SocketChannels.GAME_ON_START)
        );
    }

    /**
     * Останавливает игру, перестаёт обновлять игровое состояние.
     */
    private _endGame() {
        this._game.isStarted = false;

        clearInterval(this._updateInterval);

        this._socketManager.serverSocketTCP.of("battle").to("room").emit(
            String(Shared.Enums.SocketChannels.GAME_ON_END)
        );
    }

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

    get isGameStarted(): boolean {
        return this._game.isStarted;
    }

    private _configurate() {
        this._setAvailableColors();
        this._game.state = createState(
            createMapById(this._mapId)
        );
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
