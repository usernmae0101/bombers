import {
    GameState,
    GAME_SERVER_TICK_RATE,
    tryToMovePlayer,
    PlayerColors, ISlots, slots, Player, Cell,
    GAME_RESOLUTION_TILE_SIZE,
    GAME_RESOLUTION_TILE_LENGTH_X,
    EntityNumbers, getBombByThePlayersColor,
    GAME_RESOLUTION_TILE_LENGTH_Y, movePlayer, IOverlapData, filterOverlap, updateCellOnTheMap
} from "@bombers/shared/src/idnex";
import { Room } from "colyseus";

interface IPlayers {
    [sessionId: string]: {
        color: number;
        isReady?: boolean;
        tick?: number;
    }
}

const COLORS = [PlayerColors.BLUE, PlayerColors.PURPLE, PlayerColors.RED, PlayerColors.YELLOW];

export default class Game extends Room<GameState> {
    private _availableColors: number[] = COLORS;
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
        this._availableColors = COLORS;
    }

    protected tryToPlaceBomb(player: Player, color: number) {
        const playersRow = Math.floor((player.y + (GAME_RESOLUTION_TILE_SIZE / 2)) / GAME_RESOLUTION_TILE_SIZE);
        const playersCol = Math.floor((player.x + (GAME_RESOLUTION_TILE_SIZE / 2)) / GAME_RESOLUTION_TILE_SIZE);

        const indexOfCell = playersRow * GAME_RESOLUTION_TILE_LENGTH_X + playersCol;

        const entitiesAtThePoint = this.state.map[indexOfCell].entinies.toArray();
        const bombs = [
            EntityNumbers.BOMB_YELLOW, EntityNumbers.BOMB_RED,
            EntityNumbers.BOMB_PURPLE, EntityNumbers.BOMB_BLUE
        ];

        for (let entity of entitiesAtThePoint)
            if (bombs.includes(entity)) return;

        const bomb = getBombByThePlayersColor(color);

        updateCellOnTheMap(this.state.map, indexOfCell, bomb, "add");
        --player.bombs;

        setTimeout(() => {
            ++player.bombs;
            this._detonateTheBomb(player, indexOfCell, bomb, [playersRow, playersCol]);
        }, 2500);
    }

    private _doesEntityExistAtIndex(entity_id: number, index: number): boolean {
        return this.state.map[index].entinies.toArray().includes(entity_id);
    }

    private _spreadFlame(
        indexOfEpicenterCell: number,
        frame: number,
        blaze: { id: number, index: number }[],
        epicenterRow: number,
        epicenterCol: number,
        radius: number,
        isEndOfRadius: boolean
    ): boolean {
        let isStop = false, cellIndex: number, fire: number, isBorder: boolean;

        switch (frame) {
            case EntityNumbers.FIRE_RIGHT:
                cellIndex = indexOfEpicenterCell + radius;
                isBorder = epicenterCol + radius === GAME_RESOLUTION_TILE_LENGTH_X - 1;
                isStop = !isBorder && this._doesEntityExistAtIndex(EntityNumbers.ROCK, cellIndex + 1);
                break;
            case EntityNumbers.FIRE_LEFT:
                cellIndex = indexOfEpicenterCell - radius;
                isBorder = epicenterCol - radius === 0
                isStop = !isBorder && this._doesEntityExistAtIndex(EntityNumbers.ROCK, cellIndex - 1);
                break;
            case EntityNumbers.FIRE_TOP:
                cellIndex = indexOfEpicenterCell - (radius * GAME_RESOLUTION_TILE_LENGTH_X)
                isBorder = epicenterRow - radius === 0;
                isStop = !isBorder && this._doesEntityExistAtIndex(EntityNumbers.ROCK, cellIndex - GAME_RESOLUTION_TILE_LENGTH_X)
                break;
            case EntityNumbers.FIRE_BOTTOM:
                cellIndex = indexOfEpicenterCell + (radius * GAME_RESOLUTION_TILE_LENGTH_X);
                isBorder = epicenterRow + radius === GAME_RESOLUTION_TILE_LENGTH_Y - 1;
                isStop = !isBorder && this._doesEntityExistAtIndex(EntityNumbers.ROCK, cellIndex + GAME_RESOLUTION_TILE_LENGTH_X);
        }

        if (this._doesEntityExistAtIndex(EntityNumbers.BOX, cellIndex)) {
            isStop = true;
            updateCellOnTheMap(this.state.map, cellIndex, EntityNumbers.BOX, "remove");
            this._dropRandomItem(cellIndex);
        }

        fire = isStop || isEndOfRadius ? frame : EntityNumbers.FIRE_CENTER;
        blaze.push({ id: fire, index: cellIndex });

        return isStop;
    }

    private _detonateTheBomb(player: Player, indexOfEpicenterCell: number, bomb: number, epicenter: [number, number]) {
        updateCellOnTheMap(this.state.map, indexOfEpicenterCell, bomb, "remove");

        const [epicenterRow, epicenterCol] = epicenter;

        const blaze = [{ id: EntityNumbers.FIRE_CENTER, index: indexOfEpicenterCell }];

        let isStopRight, isStopDown, isStopUp, isStopLeft = false;

        for (let radius = 1; radius <= player.radius; radius++) {
            let isEndOfRadius = radius === player.radius;
            // spread rigth
            if (!isStopRight && epicenterCol + radius < GAME_RESOLUTION_TILE_LENGTH_X
                && !this._doesEntityExistAtIndex(EntityNumbers.ROCK, indexOfEpicenterCell + 1))
                isStopRight = this._spreadFlame(
                    indexOfEpicenterCell,
                    EntityNumbers.FIRE_RIGHT,
                    blaze, epicenterRow, epicenterCol, radius, isEndOfRadius);

            // spread left
            if (!isStopLeft && epicenterCol - radius > -1
                && !this._doesEntityExistAtIndex(EntityNumbers.ROCK, indexOfEpicenterCell - 1))
                isStopLeft = this._spreadFlame(
                    indexOfEpicenterCell,
                    EntityNumbers.FIRE_LEFT,
                    blaze, epicenterRow, epicenterCol, radius, isEndOfRadius);

            // spread up
            if (!isStopUp && epicenterRow - radius > -1
                && !this._doesEntityExistAtIndex(EntityNumbers.ROCK, indexOfEpicenterCell - GAME_RESOLUTION_TILE_LENGTH_X))
                isStopUp = this._spreadFlame(
                    indexOfEpicenterCell,
                    EntityNumbers.FIRE_TOP,
                    blaze, epicenterRow, epicenterCol, radius, isEndOfRadius);

            // spread down
            if (!isStopDown && epicenterRow + radius < GAME_RESOLUTION_TILE_LENGTH_Y
                && !this._doesEntityExistAtIndex(EntityNumbers.ROCK, indexOfEpicenterCell + GAME_RESOLUTION_TILE_LENGTH_X))
                isStopDown = this._spreadFlame(
                    indexOfEpicenterCell,
                    EntityNumbers.FIRE_BOTTOM,
                    blaze, epicenterRow, epicenterCol, radius, isEndOfRadius);
        }

        const changeVisionOfBlaze = (action: "add" | "remove") => {
            for (let flame of blaze)
                updateCellOnTheMap(this.state.map, flame.index, flame.id, action);
        };

        changeVisionOfBlaze("add");

        updateCellOnTheMap(this.state.map, indexOfEpicenterCell, EntityNumbers.CRATER, "add", true);

        setTimeout(() => { changeVisionOfBlaze("remove"); }, 500);
    }

    private _dropRandomItem(cellIndex: number) {
        if (Math.round(Math.random() * 5) > 3) {
            const items = [
                EntityNumbers.ITEM_BOMB, EntityNumbers.ITEM_HEALTH,
                EntityNumbers.ITEM_RADIUS, EntityNumbers.ITEM_SPEED
            ];
            const index = Math.floor(Math.random() * items.length);

            updateCellOnTheMap(this.state.map, cellIndex, items[index], "add");
        }
    }

    private _updatePlayers() {
        for (let { color } of Object.values(this.players)) {
            const player = this.state.plyaers.get(String(color));

            const [hasBeenMoved, field, offset] = tryToMovePlayer(player);
            if (hasBeenMoved) {
                const overlapData: IOverlapData[] = movePlayer(player, field, offset, this.state.map);
                ++player.tick;

                if (overlapData && overlapData.length)
                    filterOverlap(player, overlapData, this.state.map);
            }
        }
    }

    protected update(deltaMS: number) {
        const deltaTick = deltaMS / (1000 / GAME_SERVER_TICK_RATE);

        if (this.isGameActive) {
            this._updatePlayers();

            this._tick += 1;
        }
    }
}
