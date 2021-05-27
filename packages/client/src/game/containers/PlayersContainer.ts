import * as Shared from "@bombers/shared/src/idnex";
import BaseContainer from "../core/BaseContainer";
import { getEntityFrame } from "../core/frames";
import PlayerEntity from "../entities/PlayerEntity";

const { EntityNumbers, MoveDirections } = Shared.Enums;

interface IPlayers {
    [color: number]: {
        /** Игровая сущность игрока. */
        player: PlayerEntity;
        cache: {
            /** Последняя сохранённая позиция по X. */
            x: number;
            /** Последняя сохранённая позиция по Y. */
            y: number;
            /** Последнее сохранённое направление движения. */
            direction: number;
        }
    };
}

export default class PlayersContainer extends BaseContainer<PlayerEntity> {
    private _players: IPlayers = {};

    constructor() {
        super(Shared.Enums.ContainerLayers.PLAYERS);
    }

    update(state: Shared.Interfaces.IGameState, localPlayerColor: number) {
        this._addPlayers(state.players);
        this._removePlayers(state.players);
        this._updatePlayers(state.players, localPlayerColor);
    }

    /**
     * Удаляет игроков, если их больше нет в игровом состоянии. 
     * 
     * @param players - игроки из состояния
     */
    private _removePlayers(players: Shared.Interfaces.IGameStatePlayers) {
        for (let color in this._players) {
            if (Object.keys(players).includes(color)) continue;

            this._players[color].player.destroy();
            delete this._players[color];
        }
    }

    private _addPlayers(players: Shared.Interfaces.IGameStatePlayers) {
        for (let color in players) {
            if (Object.keys(this._players).includes(color)) continue;

            const { x: frameX, y: frameY } = getEntityFrame(EntityNumbers.PLAYER, +color, MoveDirections.DOWN);
            const player = new PlayerEntity(frameX, frameY, +color);

            this.addChild(player);
            this._players[color] = {
                player,
                cache: {
                    x: null,
                    y: null,
                    direction: MoveDirections.DOWN
                }
            };
        }
    }

    private _updatePlayers(
        players: Shared.Interfaces.IGameStatePlayers,
        localPlayerColor: number
    ) {
        for (let color in players) {
            const isXPosChanged = this._players[color].cache.x !== players[color].x;
            const isYPosChanged = this._players[color].cache.y !== players[color].y;

            // меняем позицию игрока
            if (isXPosChanged || isYPosChanged) {
                this._players[color].player.setPosition(
                    players[color].x,
                    players[color].y
                );

                this._players[color].cache.x = players[color].x;
                this._players[color].cache.y = players[color].y;
            }

            // обновляем локального игрока 
            if (+color === localPlayerColor) {
                this._players[color].player.updateArrow();
            }

            // обновляем полосу здоровья
            this._players[color].player.updateHealthbar(players[color].health);

            // меняем направление игрока
            if (this._players[color].cache.direction !== players[color].direction) {
                this._players[color].player.setDirection(players[color].direction);

                this._players[color].cache.direction = players[color].direction;
            }
        }
    }
}
