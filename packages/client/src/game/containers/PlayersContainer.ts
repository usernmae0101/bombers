import { Rectangle } from "@pixi/math";

import { ContainterLayers, GAME_RESOLUTION_TILE_OFFSET, GAME_RESOLUTION_TILE_SIZE, IGameState, IGameStatePlayers } from "@bombers/shared/src/idnex";
import BaseContainer from "../core/BaseContainer";
import Cache from "../core/Cache";
import PlayerEntity from "../entities/PlayerEntity";

interface IPlayers {
    [color: number]: PlayerEntity;
}

export default class PlayersContainer extends BaseContainer<PlayerEntity> {
    private _players: IPlayers = {};

    constructor() {
        super(ContainterLayers.PLAYER);
    }

    update(state: IGameState) { 
        this._addPlayers(state.players);
        this._removePlayers(state.players);
        this._updatePlayers(state.players);
    }

    private _removePlayers(players: IGameStatePlayers) {
        for (let color in this._players) {
            if (Object.keys(players).includes(color)) continue;

            this._players[color].destroy();
            delete this._players[color];
        }
    }

    private _addPlayers(players: IGameStatePlayers) {
        for (let color in players) {
            if (Object.keys(this._players).includes(color)) continue;

            const player = new PlayerEntity(
                Number(color),
                new Rectangle(0, 0, GAME_RESOLUTION_TILE_SIZE, GAME_RESOLUTION_TILE_SIZE)
            );

            this.addChild(player);
            this._players[color] = player;
        }
    }

    private _updatePlayers(players: IGameStatePlayers) {
        for (let color in players) {
            !Cache.player[color] && (Cache.player[color] = {
                x: null,
                y: null,
                direction: null
            });

            if (players[color].isImmortal) 
                this._players[color].blink();
            else {
                if (this._players[color].alpha !== 1)
                    this._players[color].alpha = 1;
                this._players[color].tick = 0;
            }

            if (players[color].isLocal)
                this._players[color].updateArrow(players[color].tick);

            this._players[color].setHealthbar(players[color].health);

            if (Cache.player[color].x !== players[color].x || Cache.player[color].y !== players[color].y) {
                this._players[color].setPosition(
                    players[color].x,
                    players[color].y
                );

                Cache.player[color].x = players[color].x;
                Cache.player[color].y = players[color].y;
            }

            if (Cache.player[color].direction !== players[color].direction) {
                this._players[color].setDirection(players[color].direction);

                Cache.player[color].direction = players[color].direction;
            }
        }
    }
}