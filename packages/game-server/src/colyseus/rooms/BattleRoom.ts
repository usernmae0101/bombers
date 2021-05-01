import { Client, updateLobby } from "colyseus";
import * as Shared from "@bombers/shared/src/idnex";
import Game from "../../Game";
import { GAME_STATE_BUFFER_SERVER_MAX_SIZE } from "@bombers/shared/src/idnex";

export default class BattleRoom extends Game {
    autoDispose = false;
    maxClients = 4;

    private _roomNumId: number;

    onCreate(options: Shared.IBattleOptions) {
        this._roomNumId = options.id;

        this._configurate();

        this.onMessage(Shared.SocketChannels.BATTLE_ON_PING, (client: Client, data: any) => {
            client.send(Shared.SocketChannels.BATTLE_ON_PONG, data);
        });

        this.onMessage(Shared.SocketChannels.BATTLE_ON_SEND_INPUT_KEYS, (client: Client, data: Shared.IInputKeysData) => {
            const color = this.players[client.sessionId].color;

            if (this.keysBuffer[color].queue.length <= GAME_STATE_BUFFER_SERVER_MAX_SIZE)
                this.keysBuffer[color].queue.push({ ...data });
        });

        this.onMessage(Shared.SocketChannels.BATTLE_ON_SEND_READY, (client: Client, isReady: boolean) => {
            if (!this.isGameActive) {
                this.players[client.sessionId].isReady = isReady;

                isReady ? ++this.readyPlayers : --this.readyPlayers;

                if (this.readyPlayers > 1 && this.readyTickerInterval === null) {
                    this.readyTickerInterval = setInterval(() => this._readyTicker(), 1000);
                }

                if (this.readyPlayers < 2 && this.readyTickerInterval !== null) {
                    clearInterval(this.readyTickerInterval);
                    this.readyTickerInterval = null;
                    this.readyTimer = 5;
                }
            }
        });
    }

    onJoin(client: Client, options: Shared.IBattleJoinOptions) {
        this.presence.publish(String(Shared.SocketChannels.APP_ON_JOIN_GAME), () => { });

        const color = this.chooseRandomColor();

        this.slots[color] = { ...options };
        this.broadcast(Shared.SocketChannels.BATTLE_ON_UPDATE_SLOTS, this.slots);

        this.players[client.sessionId] = { color };
        client.send(Shared.SocketChannels.BATTLE_ON_SET_INIT_DATA, { color });
    }

    onLeave(client: Client) {
        this.presence.publish(String(Shared.SocketChannels.APP_ON_LEAVE_GAME), () => { });

        const color = this.players[client.sessionId].color;

        this.slots[color] = Shared.emptySlot;
        this.broadcast(Shared.SocketChannels.BATTLE_ON_UPDATE_SLOTS, this.slots);

        delete this.players[client.sessionId];
    }

    private _configurate() {
        this.setPatchRate(Shared.SERVER_SOCKET_PATCH_RATE);
        this.setState(
            new Shared.GameState(
                Shared.inverseMap(
                    Shared.getMapByRoomId(this._roomNumId)
                )
            )
        );
        this.setMetadata({ id: this._roomNumId, isLocked: false });
        this.setSimulationInterval(deltaMS => this.update(deltaMS), 1000 / Shared.GAME_SERVER_TICK_RATE);
    }

    private _updateMetada(key: string, value: any) {
        this.setMetadata({ ...this.metadata, [key]: value }).then(() => updateLobby(this));
    }

    private _readyTicker() {
        if (--this.readyTimer === 0) {
            clearInterval(this.readyTickerInterval);
            this.readyTickerInterval = null;
            this.isGameActive = true;
            this._start();
        }

        this.broadcast(Shared.SocketChannels.BATTLE_ON_SET_START_TIMER, this.readyTimer);
    }

    private _switchStatusBattle(isBattleActive: boolean) {
        this._updateMetada("isLocked", isBattleActive);
        this.isGameActive = isBattleActive;
    }

    private _start() {
        this._initPlayers();

        for (let { color } of Object.values(this.players)) {
            this.keysBuffer[color] = { queue: [] };
        }

        this.broadcast(Shared.SocketChannels.BATTLE_ON_RUN_GAME);
        this._switchStatusBattle(true);
        this.lock();
    }

    private _initPlayers() {
        for (let { color } of Object.values(this.players)) {
            const { x, y, direction } = Shared.getInitialPlayerState(color);
            this.state.plyaers.set(String(color), new Shared.Player(direction, x, y));
        }
    }

    private _end() {
        this._switchStatusBattle(false);
        this.reset();
        this.unlock();
    }
}
