import { Application } from "pixi.js"
import Timer from "@gamestdio/timer";

import * as Shared from "@bombers/shared/src/idnex";
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
import { Dispatch } from "redux";
import * as Handlers from "../helpers/handlers/socket-game-handler";

export interface IGame {
    init: (data: Shared.IGameInitialData) => void;
    run: () => void;
}

export class Game implements IGame {
    private _app: Application;
    private _renderer: IRenderer;
    private _state: Shared.IGameState = { players: null, map: null };
    private _color: number;
    private _room: Room<Shared.GameState>;
    private _ping: number = 0;
    private _dispatch: Dispatch;
    private _delay: number = 0;
    private _keys: number[] = [];
    private _buffer: Shared.IPredictBuffer = {};
    private _tick: number = 0;
    private _snapshots: Shared.ISnapshotBuffer = {};
    private _clock: Timer = new Timer;

    constructor() {
        this._app = new Application({
            width: Shared.GAME_RESOLUTION_WIDTH,
            height: Shared.GAME_RESOLUTION_HEIGHT,
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
                Shared.RESOURCE_IMAGE_PATH_GRASS,
                Shared.RESOURCE_IMAGE_PATH_TILEMAP
            ]);
    }

    set players(value: Shared.IGameStatePlayers) {
        this._state.players = value;
    }

    set map(value: number[][][]) {
        this._state.map = value;
    }

    set room(value: Room<Shared.GameState>) {
        this._room = value;
    }

    set dispatch(value: Dispatch) {
        this._dispatch = value;
    }

    set ping(value: number) {
        this._ping = value;
    }

    onAddPlayer = (player: Shared.Player, color: string) => {
        this._state.players[Number(color)] = player.toJSON() as Shared.IGameStatePlayer;

        player.onChange = changes => {
            const _changes: Shared.IStateChanges = {};

            // @ts-ignore
            changes.forEach(change => { _changes[change.field] = change.value; });

            if (Number(color) !== this._color) {
                if (_changes.direction !== undefined || _changes.x !== undefined || _changes.y !== undefined)
                    this._insertSnapshotToBuffer(+color, _changes);
                return;
            } 

            const localPlayer = this._state.players[this._color];

            if (_changes.bombs !== undefined) 
                Handlers.handle_socket_game_on_change_bombs(this._dispatch, _changes.bombs, localPlayer);

            if (_changes.speed !== undefined) 
                Handlers.handle_socket_game_on_change_speed(this._dispatch, _changes.speed, localPlayer)

            if (_changes.radius !== undefined) 
                Handlers.handle_socket_game_on_change_radius(this._dispatch, _changes.radius);

            if (_changes.isImmortal !== undefined)
                localPlayer.isImmortal = _changes.isImmortal;

            if ((_changes.x !== undefined || _changes.y !== undefined) && player.tick)
                Shared.reconciliation(localPlayer, this._buffer, player.tick, _changes);
        };
    };

    onRemovePlayer = (_: any, color: string) => {
        delete this._state.players[Number(color)];
    };

    onMapChange = (cell: Shared.Cell, index: number) => {
        const entities = cell.entinies.toArray();

        const row = Math.floor(index / Shared.GAME_RESOLUTION_TILE_LENGTH_X);
        const col = index % Shared.GAME_RESOLUTION_TILE_LENGTH_X;

        this._state.map[row][col] = entities;
    };

    private _sendInputKeysToServer() {
        // not good. Nagle's algorithm? (will be less responsive)
        if (this._keys.length) {
            const data = { keys: this._keys, tick: this._tick };
            this._room.send(Shared.SocketChannels.BATTLE_ON_SEND_INPUT_KEYS, data);
        }
    }

    private _insertSnapshotToBuffer(color: number, changes: Shared.IStateChanges) {
        this._snapshots[color].snapshots.push({ 
            timestamp: performance.now(), 
            changes 
        });
    }

    private _moveEnemies(then: number) {
    	const alpha = Math.min((performance.now() - then) / 100, 1);
    
        for (let color in this._snapshots) {
            if (!this._state.players[color]) continue;

            const snapshots = this._snapshots[color].snapshots;
            const enemy = this._state.players[color];

            if (snapshots.length && 100 <= (performance.now() - snapshots[0].timestamp)) {
                const snapshot = snapshots.shift();

                snapshot.changes.direction !== undefined && (enemy.direction = snapshot.changes.direction);

                snapshot.changes.x !== undefined && (enemy.toX = snapshot.changes.x);
                snapshot.changes.y !== undefined && (enemy.toY = snapshot.changes.y);
            }

            if (enemy.toX !== undefined && Math.abs(enemy.toX - enemy.x) > 0.01) 
                enemy.x = Shared.lerp(enemy.x, enemy.toX, alpha);

            if (enemy.toY !== undefined && Math.abs(enemy.toY - enemy.y) > 0.01)
                enemy.y = Shared.lerp(enemy.y, enemy.toY, alpha);
        }
    }

    init(data: Shared.IGameInitialData) {
        this._color = data.color;

        // init snapshot buffer for all players except the local player
        for (let color of Shared.COLORS) {
            if (color === data.color) continue;

            this._snapshots[color] = { 
                snapshots: [] 
            };
        }

        document.getElementById(Shared.GAME_VIEW_CANVAS_ID).appendChild(this._app.view);
    }

    run() {
        this._renderer.init(this._app.stage);

        let then = performance.now();
        this._app.ticker.add((delta: number) => {
            this._moveEnemies(then);

            this._renderer.update(this._state);
            then = performance.now();
        });

        this._clock.start();
        setInterval(() => {
            this._clock.tick();
            this._update(this._clock.deltaTime);
        }, 1000 / Shared.GAME_CLIENT_TICK_RATE);
    }

    private _handleInputs() {
        switch (true) {
            case (Inputs.keys["KeyW"] || Inputs.keys["ArrowUp"]):
                this._keys.push(Shared.InputKeys.INPUT_KEY_W);
                break;
            case (Inputs.keys["KeyD"] || Inputs.keys["ArrowRight"]):
                this._keys.push(Shared.InputKeys.INPUT_KEY_D);
                break;
            case (Inputs.keys["KeyS"] || Inputs.keys["ArrowDown"]):
                this._keys.push(Shared.InputKeys.INPUT_KEY_S);
                break;
            case (Inputs.keys["KeyA"] || Inputs.keys["ArrowLeft"]):
                this._keys.push(Shared.InputKeys.INPUT_KEY_A);
                break;
        }

        if (Inputs.keys["Space"] && !Inputs.locked["Space"]) {
            this._keys.push(Shared.InputKeys.INPUT_KEY_SPACE);

            Inputs.locked["Space"] = true;
        }
    }

    private _insertPredictToBuffer() {
        if (Object.keys(this._buffer).length <= Shared.GAME_STATE_BUFFER_CLIENT_MAX_SIZE) {
            this._buffer[this._tick + 1] = {
                toX: this._state.players[this._color].toX,
                toY: this._state.players[this._color].toY,
                keys: this._keys
            };
        }
    }

    private _updatePlayer() {
        const player = this._state.players[this._color];

        const [hasBeenMoved, field, offset] = Shared.tryToMovePlayer(player, this._keys);
        if (hasBeenMoved) {
            Shared.movePlayer(player, field, offset, this._state.map);
            
            player[field === "x" ? "toX" : "toY"] = player[field];
            this._insertPredictToBuffer();
        }
    }

    private _update(deltaMS: number) {
        if (!this._state.players[this._color]) return; // fix it?

        const deltaTick = deltaMS / (1000 / Shared.GAME_CLIENT_TICK_RATE);

        this._handleInputs();
        this._sendInputKeysToServer();
        this._updatePlayer();

        // reset keys every frame
        this._keys = [];

        this._tick += 1;
    }
}
