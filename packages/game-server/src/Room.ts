import Game from "./Game";
import * as Shared from "@bombers/shared/src/idnex";
import SocketManager from "./sockets/SocketManager";
import { createState } from "./game-state";
import { createMapById } from "@bombers/shared/src/maps";
import { simulatePackageLoss } from "@bombers/shared/src/tools/network";

export default class Room {
    /** Общее количество игровых слотов. */
    private readonly _totalSlots = 4;
    /** Количество занятых игровых слотов. */
    private _activeSlots: number;
    /** Статус комнаты: открыта или закрыта. */
    private _isLocked: boolean;
    /** Идентификатор игровой карты. */
    private _mapId: Shared.Enums.GameMaps;
    /** Игровые слоты. */
    private _slots: Shared.Interfaces.IGameSlots;
    private _availableColors: Shared.Enums.PlayerColors[];
    /** Количество готовых к игре пользователей. */
    private _readyCounter: number;
    private _users: Shared.Interfaces.IRoomUsers;
    private _socketManager: SocketManager;
    private _updateInterval: NodeJS.Timeout = null;
    private _broadcastInterval: NodeJS.Timeout = null;
    private _game: Game;
    private _stateChanges: Shared.Interfaces.IStateChanges;
    private _lastChangedStateKey: string;
    private _tokens: { [color: number]: string };
    private _battleResult: { [place: number]: string; }; 

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
        this._tokens[color] = token;
        ++this._activeSlots;

        this._game.keysBuffer[color] = [];

        if (this._activeSlots === this._totalSlots)
            this._isLocked = true;

        // FIXME: передавать только изменение (подключенного пользователя) 
        this._socketManager.broadcastGameRoomSlots(this._slots);
    }

    /**
     * Отключает пользователя от комнаты, если он её покинул.
     *
     * @param token - токен пользователя
     */
    public onLeave(token: string) {
        const color = this._users[token].color;
       
        // если пользователь подтвердил готовность
        if (this._slots[this._users[token].color].isReady)
            --this._readyCounter;

        delete this._users[token];
        this._slots[color] = Shared.Helpers.makeCopyObject(Shared.Slots.emptySlot);
        this._game.removePlayerFromState(color);
        this._availableColors.push(color);
        --this._activeSlots;

        this._socketManager.broadcastGameRoomSlots(this._slots);
    }

    /**
     * Переподключает пользователя к комнате, если
     * он её не покинул. Отправляет ему состояние комнаты.
     * 
     * @param token - токен пользователя
     * @param socket - TCP-сокет пользователя
     */
    public onReconnect(token: string, socket: any) {
        this._socketManager.sendRoomDataToConnectedUser(socket, this, this._users[token].color);
    }
    
    public onEmotionChange(token: string, emotion: number) {
        this._game.updatePlayerEmotion(this._users[token].color, emotion);
    }

    /**
     * Добавляет присланные нажатые клавиши и номер 
     * игрового такта от пользователя в буфер.
     * 
     * @param token - токен пользователя
     * @param keysData - нажатые клавиши и номер такта
     */
    public onKeys(token: string, keysData: Shared.Interfaces.IKeysData) {
        if (!this.isGameStarted)
            return;
       
        simulatePackageLoss(
            Shared.Constants.DEV_NETWORK_PACKAGE_LOSS_CLIENT, 
            Shared.Constants.DEV_NETWORK_PING_SIMULATION, 
            () => {
                // FIXME: сделать буфер циклическим
                const color = this._users[token]?.color;
                color && this._game.keysBuffer[color]?.push(keysData);
            }
        );
    }

    /**
     * Если игра не запущена, меняет статус готовности пользователя 
     * к игре и обновляет количество готовых игроков. Запускает игру,
     * если готовы больше одного игрока.
     * 
     * @param token - токен пользователя
     */
    public onReady(token: string) {
        if (this._game.isStarted)
            return;

        this._slots[this._users[token].color].isReady = true;

        ++this._readyCounter > 1 && this._startGame();

        // FIXME: передавать только изменение (статус готовности) 
        this._socketManager.broadcastGameRoomSlots(this._slots);
    }

    /**
     * Отправляет результат игры всем подключенным к комнате
     * сокетам. Отключает каждый сокет. Обновляет состояние 
     * игрового сервера.
     *
     * @param result - результат игры
     */
    public onResult(result: any[]) {
        this._socketManager.serverSocketTCP.of("battle").in("room").allSockets()
            .then(sockets => {
                sockets.forEach(socketId => {
                    const socket = this._socketManager.getTCPSocketById(socketId);
                    
                    socket.emit(
                        String(Shared.Enums.SocketChannels.GAME_ON_END),
                        result
                    );
                    socket.disconnect();
                });  
                
                this._configurate();
            });
    }

    /**
     * Запускает игру, начинает обновлять игровое состояние.
     */
    private _startGame() {
        this._isLocked = true;
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
     * Останавливает игру. Перестаёт обновлять игровое состояние
     * и выполнять широковещание. Отправляет на центральный сервер
     * занимаемое место и токен игрока.
     */
    private _endGame() {
        this._socketManager.broadcastStateChanges(this._stateChanges);

        clearInterval(this._broadcastInterval);
        clearInterval(this._updateInterval);

        this._game.isStarted = false;

        // отправляем сообщение на центральный сервер
        this._socketManager.clientSocketTCP.emit(
            String(Shared.Enums.SocketChannels.GAME_ON_END),
            this._battleResult
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
        this._stateChanges = { reliable: [], notReliable: { s: {} } };
    }

    private _configurate() {
        this._setAvailableColors();
        this._game.isStarted = false;
        this._activeSlots = 0;
        this._readyCounter = 0;
        this._battleResult = {};
        this._tokens = {};
        this._users = {};
        this._slots = Shared.Slots.slots;
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
                    if (!(this._lastChangedStateKey in this._stateChanges.notReliable.s))
                        this._stateChanges.notReliable.s[this._lastChangedStateKey] = {};

                    const _key = key as keyof Shared.Interfaces.INotReliableStateData;

                    this._stateChanges.notReliable.s[this._lastChangedStateKey][_key] = value;
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

                // цвета оставшихся игроков
                const playerColors = Object.keys(this._game.state.players);

                // записываем занимаемое место игрока, который был удалён
                this._battleResult[playerColors.length + 1] = this._tokens[+(key as string)];

                // завершаем игру, если сотался один игрок
                if (playerColors.length === 1) {
                    this._battleResult[1] = this._tokens[+playerColors[0]];
                    this._endGame();
                }

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
