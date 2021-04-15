import {
    GameState,
    GAME_SERVER_TICK_RATE,
    tryToMovePlayer,
    PlayerColors, ISlots, slots, Player, Cell,
    GAME_RESOLUTION_TILE_SIZE,
    GAME_RESOLUTION_TILE_LENGTH_X,
    EntityNumbers, getBombByThePlayersColor,
    GAME_RESOLUTION_TILE_LENGTH_Y, movePlayer, IOverlapData
} from "@bombers/shared/src/idnex";
import { Room } from "colyseus";
import { ArraySchema } from "@colyseus/schema";

interface IPlayers {
    [sessionId: string]: {
        color: number;
        isReady?: boolean;
        tick?: number;
    }
}

export default class Game extends Room<GameState> {
    private _availableColors: number[] = [PlayerColors.BLUE, PlayerColors.PURPLE, PlayerColors.RED, PlayerColors.YELLOW];
    protected isGameActive = false;
    protected slots: ISlots = slots;
    protected readyPlayers: number = 0;
    protected players: IPlayers = {};
    protected readyTickerInterval: NodeJS.Timeout = null;
    protected readyTimer: number = 5;
    private _tick: number = 0;

    protected chooseRandomColor(): number {
        const index = Math.floor(Math.random() * this._availableColors.length);
        const color = this._availableColors[index];

        this._availableColors.splice(index, 1);

        return color;
    }

    get tick(): number { 
        return this._tick; 
    }

    protected reset() {
        this.slots = slots;
        this.readyPlayers = 0;
        this.readyTimer = 5;
        this._tick = 0;
        this._availableColors = [PlayerColors.BLUE, PlayerColors.PURPLE, PlayerColors.RED, PlayerColors.YELLOW];
    }

    protected tryToPlaceBomb(map: ArraySchema<Cell>, player: Player, color: number) {
        const playersRow = Math.floor((player.y + (GAME_RESOLUTION_TILE_SIZE / 2)) / GAME_RESOLUTION_TILE_SIZE);
        const playersCol = Math.floor((player.x + (GAME_RESOLUTION_TILE_SIZE / 2)) / GAME_RESOLUTION_TILE_SIZE);

        const indexOfCell = playersRow * GAME_RESOLUTION_TILE_LENGTH_X + playersCol;

        const entitiesAtThePoint = map[indexOfCell].entinies.toArray();
        const bombs = [
            EntityNumbers.BOMB_YELLOW, EntityNumbers.BOMB_RED,
            EntityNumbers.BOMB_PURPLE, EntityNumbers.BOMB_BLUE
        ];

        for (let entity of entitiesAtThePoint)
            if (bombs.includes(entity)) return;

        const bomb = getBombByThePlayersColor(color);

        this._updateCellOnTheMap(map, indexOfCell, bomb, "add");
        --player.bombs;

        setTimeout(() => {
            ++player.bombs;
            this._detonateTheBomb(player, map, indexOfCell, bomb, [playersRow, playersCol]);
        }, 2500);
    }

    private _doesEntityExistAtIndex(map: ArraySchema<Cell>, entity_id: number, index: number): boolean {
        return map[index].entinies.toArray().includes(entity_id);
    }

    private _detonateTheBomb(player: Player, map: ArraySchema<Cell>, indexOfEpicenterCell: number, bomb: number, epicenter: [number, number]) {
        this._updateCellOnTheMap(map, indexOfEpicenterCell, bomb, "remove");

        const [epicenterRow, epicenterCol] = epicenter;

        const blaze = [{ id: EntityNumbers.FIRE_CENTER, index: indexOfEpicenterCell }];
        let isStopRight, isStopDown, isStopUp, isStopLeft = false;

        for (let radius = 1, fire, cellIndex; radius <= player.radius; radius++) {
            // spread rigth
            if (!isStopRight && epicenterCol + radius < GAME_RESOLUTION_TILE_LENGTH_X
                && !this._doesEntityExistAtIndex(map, EntityNumbers.ROCK, indexOfEpicenterCell + 1)) {
                cellIndex = indexOfEpicenterCell + radius;

                const isRightBorder = epicenterCol + radius === GAME_RESOLUTION_TILE_LENGTH_X - 1;
                isStopRight = !isRightBorder && this._doesEntityExistAtIndex(map, EntityNumbers.ROCK, cellIndex + 1);

                if (this._doesEntityExistAtIndex(map, EntityNumbers.BOX, cellIndex)) {
                    isStopRight = true;
                    this._updateCellOnTheMap(map, cellIndex, EntityNumbers.BOX, "remove");
                    this._dropRandomItem(map, cellIndex);
                }

                fire = isStopRight || radius === player.radius ? EntityNumbers.FIRE_RIGHT : EntityNumbers.FIRE_CENTER;
                blaze.push({ id: fire, index: cellIndex });
            }

            // spread left
            if (!isStopLeft && epicenterCol - radius > -1
                && !this._doesEntityExistAtIndex(map, EntityNumbers.ROCK, indexOfEpicenterCell - 1)) {
                cellIndex = indexOfEpicenterCell - radius;

                const isLeftBorder = epicenterCol - radius === 0;
                isStopLeft = !isLeftBorder && this._doesEntityExistAtIndex(map, EntityNumbers.ROCK, cellIndex - 1);

                if (this._doesEntityExistAtIndex(map, EntityNumbers.BOX, cellIndex)) {
                    isStopLeft = true;
                    this._updateCellOnTheMap(map, cellIndex, EntityNumbers.BOX, "remove");
                    this._dropRandomItem(map, cellIndex);
                }

                fire = isStopLeft || radius === player.radius ? EntityNumbers.FIRE_LEFT : EntityNumbers.FIRE_CENTER;
                blaze.push({ id: fire, index: cellIndex });
            }

            // spread up
            if (!isStopUp && epicenterRow - radius > -1
                && !this._doesEntityExistAtIndex(map, EntityNumbers.ROCK, indexOfEpicenterCell - GAME_RESOLUTION_TILE_LENGTH_X)) {
                cellIndex = indexOfEpicenterCell - (radius * GAME_RESOLUTION_TILE_LENGTH_X);

                const isUpBorder = epicenterRow - radius === 0;
                isStopUp = !isUpBorder && this._doesEntityExistAtIndex(map, EntityNumbers.ROCK, cellIndex - GAME_RESOLUTION_TILE_LENGTH_X);

                if (this._doesEntityExistAtIndex(map, EntityNumbers.BOX, cellIndex)) {
                    isStopUp = true;
                    this._updateCellOnTheMap(map, cellIndex, EntityNumbers.BOX, "remove");
                    this._dropRandomItem(map, cellIndex);
                }

                fire = isStopUp || radius === player.radius ? EntityNumbers.FIRE_TOP : EntityNumbers.FIRE_CENTER;
                blaze.push({ id: fire, index: cellIndex });
            }

            // spread down
            if (!isStopDown && epicenterRow + radius < GAME_RESOLUTION_TILE_LENGTH_Y
                && !this._doesEntityExistAtIndex(map, EntityNumbers.ROCK, indexOfEpicenterCell + GAME_RESOLUTION_TILE_LENGTH_X)) {
                cellIndex = indexOfEpicenterCell + (radius * GAME_RESOLUTION_TILE_LENGTH_X);

                const isDownBorder = epicenterRow + radius === GAME_RESOLUTION_TILE_LENGTH_Y - 1;
                isStopDown = !isDownBorder && this._doesEntityExistAtIndex(map, EntityNumbers.ROCK, cellIndex + GAME_RESOLUTION_TILE_LENGTH_X);

                if (this._doesEntityExistAtIndex(map, EntityNumbers.BOX, cellIndex)) {
                    isStopDown = true;
                    this._updateCellOnTheMap(map, cellIndex, EntityNumbers.BOX, "remove");
                    this._dropRandomItem(map, cellIndex);
                }

                fire = isStopDown || radius === player.radius ? EntityNumbers.FIRE_BOTTOM : EntityNumbers.FIRE_CENTER;
                blaze.push({ id: fire, index: cellIndex });
            }
        }

        const changeVisionOfBlaze = (action: "add" | "remove") => {
            for (let flame of blaze)
                this._updateCellOnTheMap(map, flame.index, flame.id, action);
        };

        changeVisionOfBlaze("add");

        this._updateCellOnTheMap(map, indexOfEpicenterCell, EntityNumbers.CRATER, "add", true);

        setTimeout(() => { changeVisionOfBlaze("remove"); }, 500);
    }

    private _dropRandomItem(map: ArraySchema<Cell>, cellIndex: number) {
        if (Math.round(Math.random() * 5) > 3) {
            const items = [
                EntityNumbers.ITEM_BOMB, EntityNumbers.ITEM_HEALTH,
                EntityNumbers.ITEM_RADIUS, EntityNumbers.ITEM_SPEED
            ];
            const index = Math.floor(Math.random() * items.length);

            this._updateCellOnTheMap(map, cellIndex, items[index], "add");
        }
    }

    private _updateCellOnTheMap(map: ArraySchema<Cell>, indexOfCell: number, entity_id: number, action: "add" | "remove", doCheckDubs?: boolean) {
        const entities = map[indexOfCell].entinies.toArray();

        if (action === "add") {
            if (doCheckDubs && entities.includes(entity_id)) return;
            entities.push(entity_id);
        }

        if (action === "remove") {
            const entitityIndex = entities.findIndex(id => id === entity_id);
            entities.splice(entitityIndex, 1);
        }

        map[indexOfCell] = new Cell(entities);
    }

    private _updatePlayers(state: GameState) {
        for (let { color } of Object.values(this.players)) {
            const player = state.plyaers.get(String(color));

            const [hasBeenMoved, field, offset] = tryToMovePlayer(player);
            if (hasBeenMoved) {
                const overlapData: IOverlapData[] = movePlayer(player, field, offset, state.map);
                ++player.tick;
                
                console.log(overlapData);
                // interete to overlap array
            }
        }
    }


    protected update(deltaMS: number, state: GameState) {
        const deltaTick = deltaMS / (1000 / GAME_SERVER_TICK_RATE);

        if (this.isGameActive) {
            this._updatePlayers(state);

            this._tick += 1;
        }
    }
}
