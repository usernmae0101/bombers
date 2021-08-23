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

    update(state: Shared.Interfaces.IGameState, localPlayerColor: number, dt: number) {
        this._addPlayers(state.players);
        this._removePlayers(state.players);
        this._updatePlayers(state.players, localPlayerColor, dt);
    }

    /**
     * Удаляет игроков, если их больше нет в игровом состоянии. 
     * 
     * @param players - игроки из состояния
     */
    private _removePlayers(players: Shared.Interfaces.IGameStatePlayers) {
        for (let color in this._players) {
            if (Object.keys(players).includes(color))
                continue;

            this._players[color].player.destroy();
            delete this._players[color];
        }
    }

    private _addPlayers(players: Shared.Interfaces.IGameStatePlayers) {
        for (let color in players) {
            if (Object.keys(this._players).includes(color))
                continue;

            const { x: frameX, y: frameY } = getEntityFrame(EntityNumbers.PLAYER, +color, players[color].direction);
            const player = new PlayerEntity(frameX, frameY, +color);
    
            // устанавливаем эмоцию игрока
            player.updateEmotion(players[color].emotion, players[color].direction);

            this.addChild(player);
            this._players[color] = {
                player,
                cache: {
                    x: players[color].x,
                    y: players[color].y,
                    direction: MoveDirections.DOWN
                }
            };
        }
    }

    private _updatePlayers(
        players: Shared.Interfaces.IGameStatePlayers,
        localPlayerColor: number,
        dt: number
    ) {
        for (let color in players) {
            const isXPosChanged = this._players[color].cache.x !== players[color].x;
            const isYPosChanged = this._players[color].cache.y !== players[color].y;

            // меняем позицию игрока
            if (isXPosChanged || isYPosChanged) {
                if (+color === localPlayerColor) {
                    const ratio = 1 / dt;

                    this._players[color].cache.x = Shared.Maths.lerp(this._players[color].cache.x, players[color].x, ratio > 1 ? 1 : ratio);
                    this._players[color].cache.y = Shared.Maths.lerp(this._players[color].cache.y, players[color].y, ratio > 1 ? 1 : ratio);
                }

                else {
                    this._players[color].cache.x = players[color].x; 
                    this._players[color].cache.y = players[color].y;
                }

                this._players[color].player.setPosition(
                    this._players[color].cache.x, 
                    this._players[color].cache.y
                );
            }

            // обновляем локального игрока 
            if (+color === localPlayerColor) {
                this._players[color].player.updateArrow();
            }

            // мелькаем игроком, если он получил урон
            if (players[color].isImmortal)
                this._players[color].player.blink(5, 0);
            else if (this._players[color].player.alpha !== 1)
                this._players[color].player.alpha = 1;

            // обновляем полосу здоровья
            this._players[color].player.updateHealthbar(players[color].health);

            // меняем направление игрока и обновляем эмоцию
            if (this._players[color].cache.direction !== players[color].direction) {
                this._players[color].player.setDirection(players[color].direction);
                this._players[color].player.updateEmotion(players[color].emotion, players[color].direction);

                this._players[color].cache.direction = players[color].direction;
            }
        }
    }
}
