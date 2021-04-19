import * as Shared from "@bombers/shared/src/idnex";
import { IKeysBuffer } from "@bombers/shared/src/idnex";
import { Room } from "colyseus";

interface IPlayers {
    [sessionId: string]: {
        color: number;
        isReady?: boolean;
        tick?: number;
    }
}

const COLORS = [
    Shared.PlayerColors.BLUE, Shared.PlayerColors.PURPLE,
    Shared.PlayerColors.RED, Shared.PlayerColors.YELLOW
];

export default class Game extends Room<Shared.GameState> {
    private _availableColors: number[] = COLORS;
    protected isGameActive = false;
    protected slots: Shared.ISlots = Shared.slots;
    protected keysBuffer: IKeysBuffer = [];
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
        this.slots = Shared.slots;
        this.readyPlayers = 0;
        this.readyTimer = 5;
        this._tick = 0;
        this.keysBuffer = [];
        this._availableColors = COLORS;
    }
 
    protected tryToPlaceBomb(player: Shared.Player, color: number, keys: number[]) {
        if (!keys.includes(Shared.InputKeys.INPUT_KEY_SPACE)) return;
        if (!player.bombs) return;

        const playersRow = Math.floor((player.y + (Shared.GAME_RESOLUTION_TILE_SIZE / 2)) / Shared.GAME_RESOLUTION_TILE_SIZE);
        const playersCol = Math.floor((player.x + (Shared.GAME_RESOLUTION_TILE_SIZE / 2)) / Shared.GAME_RESOLUTION_TILE_SIZE);

        const indexOfCell = playersRow * Shared.GAME_RESOLUTION_TILE_LENGTH_X + playersCol;

        const entitiesAtThePoint = this.state.map[indexOfCell].entinies.toArray();
        const bombs = [
            Shared.EntityNumbers.BOMB_YELLOW, Shared.EntityNumbers.BOMB_RED,
            Shared.EntityNumbers.BOMB_PURPLE, Shared.EntityNumbers.BOMB_BLUE
        ];

        for (let entity of entitiesAtThePoint)
            if (bombs.includes(entity)) return;

        const bomb = Shared.getBombByThePlayersColor(color);

        Shared.updateCellOnTheMap(this.state.map, indexOfCell, bomb, "add");
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
            case Shared.EntityNumbers.FIRE_RIGHT:
                cellIndex = indexOfEpicenterCell + radius;
                isBorder = epicenterCol + radius === Shared.GAME_RESOLUTION_TILE_LENGTH_X - 1;
                isStop = !isBorder && this._doesEntityExistAtIndex(Shared.EntityNumbers.ROCK, cellIndex + 1);
                break;
            case Shared.EntityNumbers.FIRE_LEFT:
                cellIndex = indexOfEpicenterCell - radius;
                isBorder = epicenterCol - radius === 0
                isStop = !isBorder && this._doesEntityExistAtIndex(Shared.EntityNumbers.ROCK, cellIndex - 1);
                break;
            case Shared.EntityNumbers.FIRE_TOP:
                cellIndex = indexOfEpicenterCell - (radius * Shared.GAME_RESOLUTION_TILE_LENGTH_X)
                isBorder = epicenterRow - radius === 0;
                isStop = !isBorder && this._doesEntityExistAtIndex(Shared.EntityNumbers.ROCK, cellIndex - Shared.GAME_RESOLUTION_TILE_LENGTH_X)
                break;
            case Shared.EntityNumbers.FIRE_BOTTOM:
                cellIndex = indexOfEpicenterCell + (radius * Shared.GAME_RESOLUTION_TILE_LENGTH_X);
                isBorder = epicenterRow + radius === Shared.GAME_RESOLUTION_TILE_LENGTH_Y - 1;
                isStop = !isBorder && this._doesEntityExistAtIndex(Shared.EntityNumbers.ROCK, cellIndex + Shared.GAME_RESOLUTION_TILE_LENGTH_X);
        }

        if (this._doesEntityExistAtIndex(Shared.EntityNumbers.BOX, cellIndex)) {
            isStop = true;
            Shared.updateCellOnTheMap(this.state.map, cellIndex, Shared.EntityNumbers.BOX, "remove");
            this._dropRandomItem(cellIndex);
        }

        fire = isStop || isEndOfRadius ? frame : Shared.EntityNumbers.FIRE_CENTER;
        blaze.push({ id: fire, index: cellIndex });

        return isStop;
    }

    private _detonateTheBomb(player: Shared.Player, indexOfEpicenterCell: number, bomb: number, epicenter: [number, number]) {
        Shared.updateCellOnTheMap(this.state.map, indexOfEpicenterCell, bomb, "remove");

        const [epicenterRow, epicenterCol] = epicenter;

        const blaze = [{ id: Shared.EntityNumbers.FIRE_CENTER, index: indexOfEpicenterCell }];

        let isStopRight, isStopDown, isStopUp, isStopLeft = false;

        for (let radius = 1; radius <= player.radius; radius++) {
            let isEndOfRadius = radius === player.radius;

            // spread rigth
            if (!isStopRight && epicenterCol + radius < Shared.GAME_RESOLUTION_TILE_LENGTH_X
                && !this._doesEntityExistAtIndex(Shared.EntityNumbers.ROCK, indexOfEpicenterCell + 1))
                isStopRight = this._spreadFlame(
                    indexOfEpicenterCell,
                    Shared.EntityNumbers.FIRE_RIGHT,
                    blaze, epicenterRow, epicenterCol, radius, isEndOfRadius);

            // spread left
            if (!isStopLeft && epicenterCol - radius > -1
                && !this._doesEntityExistAtIndex(Shared.EntityNumbers.ROCK, indexOfEpicenterCell - 1))
                isStopLeft = this._spreadFlame(
                    indexOfEpicenterCell,
                    Shared.EntityNumbers.FIRE_LEFT,
                    blaze, epicenterRow, epicenterCol, radius, isEndOfRadius);

            // spread up
            if (!isStopUp && epicenterRow - radius > -1
                && !this._doesEntityExistAtIndex(Shared.EntityNumbers.ROCK, indexOfEpicenterCell - Shared.GAME_RESOLUTION_TILE_LENGTH_X))
                isStopUp = this._spreadFlame(
                    indexOfEpicenterCell,
                    Shared.EntityNumbers.FIRE_TOP,
                    blaze, epicenterRow, epicenterCol, radius, isEndOfRadius);

            // spread down
            if (!isStopDown && epicenterRow + radius < Shared.GAME_RESOLUTION_TILE_LENGTH_Y
                && !this._doesEntityExistAtIndex(Shared.EntityNumbers.ROCK, indexOfEpicenterCell + Shared.GAME_RESOLUTION_TILE_LENGTH_X))
                isStopDown = this._spreadFlame(
                    indexOfEpicenterCell,
                    Shared.EntityNumbers.FIRE_BOTTOM,
                    blaze, epicenterRow, epicenterCol, radius, isEndOfRadius);
        }

        const changeVisionOfBlaze = (action: "add" | "remove") => {
            for (let flame of blaze)
                Shared.updateCellOnTheMap(this.state.map, flame.index, flame.id, action);
        };

        changeVisionOfBlaze("add");

        Shared.updateCellOnTheMap(this.state.map, indexOfEpicenterCell, Shared.EntityNumbers.CRATER, "add", true);

        setTimeout(() => { changeVisionOfBlaze("remove"); }, 500);
    }

    private _dropRandomItem(cellIndex: number) {
        if (Math.round(Math.random() * 5) > 3) {
            const items = [
                Shared.EntityNumbers.ITEM_BOMB, Shared.EntityNumbers.ITEM_HEALTH,
                Shared.EntityNumbers.ITEM_RADIUS, Shared.EntityNumbers.ITEM_SPEED
            ];
            const index = Math.floor(Math.random() * items.length);

            Shared.updateCellOnTheMap(this.state.map, cellIndex, items[index], "add");
        }
    }

    private _updatePlayers() {
        for (let { color } of Object.values(this.players)) {
            if (this.keysBuffer[color].queue.length) {
                const player = this.state.plyaers.get(String(color));
                const { keys, tick } = this.keysBuffer[color].queue.shift();

                this.tryToPlaceBomb(player, color, keys);

                const [hasBeenMoved, field, offset] = Shared.tryToMovePlayer(player, keys);
                if (hasBeenMoved) {
                    const overlapData: Shared.IOverlapData[] = Shared.movePlayer(player, field, offset, this.state.map);
                    player.tick = tick + 1;

                    if (overlapData && overlapData.length)
                        Shared.filterOverlap(player, overlapData, this.state.map);
                }
            }
        }
    }

    protected update(deltaMS: number) {
        const deltaTick = deltaMS / (1000 / Shared.GAME_SERVER_TICK_RATE);

        if (this.isGameActive) {
            this._updatePlayers();

            this._tick += 1;
        }
    }
}
