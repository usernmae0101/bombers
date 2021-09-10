import Game from "./Game";
import * as Shared from "@bombers/shared/src/idnex";
import SocketManager from "./sockets/SocketManager";
import { createState } from "./game-state";
import { createMapById } from "@bombers/shared/src/maps";

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
    private _broadcastInterval: NodeJS.Timeout = null;
    private _game: Game;
    private _stateChanges: Shared.Interfaces.IStateChanges;
    private _lastChangedStateKey: string;

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
        this._game.addPlayerToState(color);
        ++this._activeSlots;

        this._game.keysBuffer[color] = [];

        if (this._activeSlots === this._totalSlots)
            this._isLocked = true;

        // FIXME: передавать только изменение (подключенного пользователя) 
        this._socketManager.broadcastGameRoomSlots(this._slots);
    }

    // TODO:
    public onLeave() {

    }

    public onReconnect(token: string, socket: any) {
        const color = this._users[token].color;
        
        this._socketManager.sendRoomDataToConnectedUser(socket, this, color);
    }
    
    public onEmotionChange(token: string, emotion: number) {
        const color = this._users[token].color;
        
        this._game.updatePlayerEmotion(color, emotion);
    }

    /**
     * Добавляет присланные нажатые клавиши и номер 
     * игрового такта от пользователя в буфер.
     * 
     * @param token - токен пользователя
     * @param keysData - нажатые клавиши и номер такта
     */
    public onKeys(token: string, keysData: Shared.Interfaces.IKeysData) {
        const color = this._users[token].color;

        // FIXME: ограничить буфер
        this._game.keysBuffer[color].push(keysData);
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
        this._game.bombsState = Shared.Helpers.createBombsState(this._users);

        // широковещание игрового состояния
        this._broadcastInterval = setInterval(() => {
            this._socketManager.broadcastStateChanges(this._stateChanges);
            this._resetStateChanges();
        }, 1000 / Shared.Constants.GAME_SERVER_BROADCAST_RATE);

        let accumulator = 0;
        let then = +(new Date());

        // обновление игрового состояния
        this._updateInterval = setInterval(() => {
            const now = +(new Date());
            let frameTime = now - then;
            frameTime = frameTime > Shared.Constants.GAME_MAXIMUM_DELTA_TIME 
                ? Shared.Constants.GAME_MAXIMUM_DELTA_TIME 
                : frameTime;
            then = now;

            accumulator += frameTime;

            if (!this._game.isStarted) {
                this._endGame();
                return;
            }
            
            while (accumulator >= Shared.Constants.GAME_FIXED_DELTA_TIME) {
                this._game.update();
                accumulator -= Shared.Constants.GAME_FIXED_DELTA_TIME;
            }
        }, 1000 / Shared.Constants.GAME_SERVER_TICK_RATE);

        this._socketManager.serverSocketTCP.of("battle").to("room").emit(
            String(Shared.Enums.SocketChannels.GAME_ON_START)
        );
    }

    /**
     * Останавливает игру, перестаёт обновлять игровое состояние.
     */
    private _endGame() {
        clearInterval(this._broadcastInterval);
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

    private _resetStateChanges() {
        this._stateChanges = { reliable: [], notReliable: {} };
    }

    private _configurate() {
        this._setAvailableColors();
        this._resetStateChanges();

        const state = createState(
            createMapById(this._mapId)
        );

        // вешаем Proxy на state, чтобы отлавливать изменения
        const stateHandler: ProxyHandler<any> = {
            get: (target, key) => {
                if (typeof target[key] === "object" && target[key] !== null) {
                    // записываем ключ, чтобы понять что поменялось
                    this._lastChangedStateKey = key as string;

                    return new Proxy(target[key], stateHandler);
                }

                return target[key];
            },
            set: (target, key, value, receiver) => {
                // массив, значит карта - передаём надёжно
                if (Array.isArray(target)) {
                    this._stateChanges.reliable.push(
                        {
                            row: this._lastChangedStateKey,
                            col: key,
                            entities: value
                        }
                    );
                }

                // поменяли координаты игрока - передаём ненадёжно
                else if (["x", "y", "tick", "direction"].includes(key as string)) {
                    if (!(this._lastChangedStateKey in this._stateChanges.notReliable))
                        this._stateChanges.notReliable[this._lastChangedStateKey] = {};

                    const _key = key as keyof Shared.Interfaces.INotReliableStateData;

                    this._stateChanges.notReliable[this._lastChangedStateKey][_key] = value;
                }

                // какие-то другие хар-ки игрока (или сам игрок) - передаём надёжно
                else {
                    this._stateChanges.reliable.push(
                        {
                            color: this._lastChangedStateKey,
                            key,
                            value
                        }
                    );
                }
                return Reflect.set(target, key, value, receiver);
            },
            deleteProperty: (target, key) => {
                Reflect.deleteProperty(target, key);

                // удалили игрока из состояния - передаём надёжно
                this._stateChanges.reliable.push(
                    {
                        delete: key
                    }
                );

                return true;
            }
        };

        this._game.state = state;
        this._game.proxyState = new Proxy(state, stateHandler);
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
