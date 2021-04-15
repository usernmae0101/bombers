import { Application } from "pixi.js"
import Timer from "@gamestdio/timer";

import {
    GAME_CLIENT_TICK_RATE,
    GameState,
    GAME_RESOLUTION_HEIGHT,
    GAME_RESOLUTION_WIDTH,
    GAME_VIEW_CANVAS_ID,
    ISnapshotBuffer,
    IPredictBuffer,
    IGameState,
    IGameStatePlayer,
    IGameStatePlayers,
    MoveDirections,
    RESOURCE_IMAGE_PATH_GRASS,
    RESOURCE_IMAGE_PATH_TILEMAP,
    SocketChannels,
    IStateChanges,
    GAME_STATE_BUFFER_CLIENT_MAX_SIZE,
    tryToMovePlayer,
    reconciliation,
    lerp,
    SERVER_SOCKET_PATCH_RATE,
    Player,
    IGameInitialData,
    Cell,
    GAME_RESOLUTION_TILE_LENGTH_X,
    movePlayer,
} from "@bombers/shared/src/idnex";
import BombsContainer from "./containers/BombsContainer";
import BoxesContainer from "./containers/BoxesContainer";
import CratersContainer from "./containers/CratersContainer";
import FiresContainer from "./containers/FiresContainer";
import GrassContainer from "./containers/GrassContainer";
import ItemsContainer from "./containers/ItemsContainer";
import PlayersContainer from "./containers/PlayersContainer";
import RocksContainer from "./containers/RocksContainer";
import Inputs from "./core/Inputs";
import { IRenderer, Renderer } from "./core/Renderer";
import { Room } from "colyseus.js";
import Cache from "./core/Cache";
import { Dispatch } from "redux";
import { action_game_set_ping } from "../ui/redux/actions/game-actions";

export interface IGame {
    init: (data: IGameInitialData) => void;
    run: () => void;
}

export class Game implements IGame {
    private _app: Application;
    private _renderer: IRenderer;
    private _state: IGameState = { players: null, map: null };
    private _color: number;
    private _room: Room<GameState>;
    private _ping: number = 0;
    private _dispatch: Dispatch;
    private _delay: number = 0;
    private _buffer: IPredictBuffer = {};
    private _tick: number = 0;
    private _snapshots: ISnapshotBuffer = {};
    private _clock: Timer = new Timer;
    private _pingInterval: NodeJS.Timeout = null;

    constructor() {
        this._app = new Application({
            width: GAME_RESOLUTION_WIDTH,
            height: GAME_RESOLUTION_HEIGHT,
            backgroundColor: 0xe1e1e1e1
        });

        this._renderer = new Renderer([
            new GrassContainer,
            new BoxesContainer,
            new PlayersContainer,
            new RocksContainer,
            new CratersContainer,
            new BombsContainer,
            new FiresContainer,
            new ItemsContainer
        ]);

        this._app.loader
            .add([
                RESOURCE_IMAGE_PATH_GRASS,
                RESOURCE_IMAGE_PATH_TILEMAP
            ]);
    }

    set players(value: IGameStatePlayers) { 
        this._state.players = value; 
    }

    set map(value: number[][][]) { 
        this._state.map = value; 
    }

    set room(value: Room<GameState>) { 
        this._room = value; 
    }

    set dispatch(value: Dispatch) { 
        this._dispatch = value; 
    }

    get ping(): number { 
        return this._ping; 
    }

    onAddPlayer = (player: Player, color: string) => {
        this._state.players[Number(color)] = player.toJSON() as IGameStatePlayer;

        player.onChange = changes => {
            const _changes: IStateChanges = {};

            // @ts-ignore
            changes.forEach(change => { _changes[change.field] = change.value; });

            if (Number(color) !== this._color) {
                if (_changes.direction !== undefined || _changes.x !== undefined || _changes.y !== undefined)
                    this._insertSnapshotToBuffer(+color, _changes);
                return;
            }

            if ((_changes.x !== undefined || _changes.y !== undefined) && player.tick)
                reconciliation(this._state.players[this._color], this._buffer, player.tick, _changes);
        };
    };

    onRemovePlayer = (_: any, color: string) => {
        delete this._state.players[Number(color)];
    };

    onMapChange = (cell: Cell, index: number) => {
        const entities = cell.entinies.toArray();
       
        const row = Math.floor(index / GAME_RESOLUTION_TILE_LENGTH_X);
        const col = index % GAME_RESOLUTION_TILE_LENGTH_X;
				
        this._state.map[row][col] = entities;
    }; 

    onPong = (data: any) => {
        this._ping = Date.now() - data.t;
        this._delay = this._ping + SERVER_SOCKET_PATCH_RATE;
        
        this._dispatch(action_game_set_ping(this._ping));
    };

    private _sendMoveInputs(isMove: boolean, direction: number) {
        if (Cache.state.direction !== direction || Cache.state.isMove !== isMove) {
            this._room.send(SocketChannels.BATTLE_ON_SET_MOVE, { isMove, direction, tick: this._tick });

            Cache.state.direction = direction;
            Cache.state.isMove = isMove;

            this._state.players[this._color].direction = direction;
            this._state.players[this._color].isMove = isMove;

            // keep moving until the ping offset       
        }
    }

    private _insertSnapshotToBuffer(color: number, changes: IStateChanges) {
        if (!this._snapshots[color])
            this._snapshots[color] = { snapshots: [] };

        this._snapshots[color].snapshots.push({ timestamp: performance.now(), changes });
    }

    private _movePlayer(alpha: number) {
        const player = this._state.players[this._color];

        if (player && player.toX !== undefined && Math.abs(player.toX - player.x) > 0.01)
            player.x = lerp(player.x, player.toX, alpha * 1.05);

        if (player && player.toY !== undefined && Math.abs(player.toY - player.y) > 0.01)
            player.y = lerp(player.y, player.toY, alpha * 1.05);
    }

    private _moveEnemies(alpha: number) {
        for (let color in this._snapshots) {
            const snapshots = this._snapshots[color].snapshots;
            const enemy = this._state.players[color];

            if (snapshots.length && this._delay <= (performance.now() - snapshots[0].timestamp)) {
                const snapshot = snapshots.shift();

                snapshot.changes.direction !== undefined && (enemy.direction = snapshot.changes.direction);

                snapshot.changes.x !== undefined && (enemy.toX = snapshot.changes.x);
                snapshot.changes.y !== undefined && (enemy.toY = snapshot.changes.y);
            }

            if (enemy.toX !== undefined && Math.abs(enemy.toX - enemy.x) > 0.01)
                enemy.x = lerp(enemy.x, enemy.toX, alpha);

            if (enemy.toY !== undefined && Math.abs(enemy.toY - enemy.y) > 0.01)
                enemy.y = lerp(enemy.y, enemy.toY, alpha);
        }
    }

    startPing() {
        this._room.send(SocketChannels.BATTLE_ON_PING, { t: Date.now() });

        this._pingInterval = setInterval(() => {
            this._room.send(SocketChannels.BATTLE_ON_PING, { t: Date.now() })
        }, 5000);
    }

    init(data: IGameInitialData) {
        this._color = data.color;

        Cache.state.direction = MoveDirections.DOWN;
        document.getElementById(GAME_VIEW_CANVAS_ID).appendChild(this._app.view);
    }

    run() {
        this._renderer.init(this._app.stage);

        let then = performance.now();
        this._app.ticker.add((delta: number) => {
            const alpha = Math.min((performance.now() - then) / this._delay, 1);

            //this._movePlayer(alpha);
            this._moveEnemies(alpha);

            this._renderer.update(this._state);
            then = performance.now();
        });

        this._clock.start();
        setInterval(() => {
            this._clock.tick();
            this._update(this._clock.deltaTime);
        }, 1000 / GAME_CLIENT_TICK_RATE);
    }

    over() {
        clearInterval(this._pingInterval);
    }

    private _handleInputs() {
        switch (true) {
            case (Inputs.keys["KeyW"] || Inputs.keys["ArrowUp"]):
                this._sendMoveInputs(true, MoveDirections.UP);
                break;
            case (Inputs.keys["KeyD"] || Inputs.keys["ArrowRight"]):
                this._sendMoveInputs(true, MoveDirections.RIGHT);
                break;
            case (Inputs.keys["KeyS"] || Inputs.keys["ArrowDown"]):
                this._sendMoveInputs(true, MoveDirections.DOWN);
                break;
            case (Inputs.keys["KeyA"] || Inputs.keys["ArrowLeft"]):
                this._sendMoveInputs(true, MoveDirections.LEFT);
                break;
            default: this._sendMoveInputs(false, Cache.state.direction);
        }

        if (Inputs.keys["Space"] && !Inputs.locked["Space"]) {
            this._room.send(SocketChannels.BATTLE_ON_PLACE_BOMB);
            Inputs.locked["Space"] = true;
        }
    }

    private _insertPredictToBuffer() {
        if (Object.keys(this._buffer).length <= GAME_STATE_BUFFER_CLIENT_MAX_SIZE) {
            this._buffer[this._tick] = {
                toX: this._state.players[this._color].toX,
                toY: this._state.players[this._color].toY
            };
        }
    }

    private _updatePlayer() {
        const player = this._state.players[this._color];
        const [hasBeenMoved, field, offset] = tryToMovePlayer(player);
        if (hasBeenMoved) {
            movePlayer(player, field, offset, this._state.map);
            player[field === "x" ? "toX" : "toY"] = player[field];
            this._insertPredictToBuffer();
        }
    }

    private _update(deltaMS: number) {
        const deltaTick = deltaMS / (1000 / GAME_CLIENT_TICK_RATE);

        if (this._state.players[this._color]) { // fix it?
            this._updatePlayer();
            this._handleInputs();
        }

        this._tick += 1;
    }
}
