import { Helpers, Constants, Enums } from "@bombers/shared/src/idnex";
import { createPlayer } from "@bombers/game-server/src/core/game-state";

describe("helpers should works correctly", () => {
    it("should calculates correct players cell position", () => {
        const playerX = Constants.GAME_RESOLUTION_TILE_SIZE + 1;
        const playerY = Constants.GAME_RESOLUTION_TILE_SIZE * 2 + 1;
        expect(Helpers.calculatePlayerCellPosition(createPlayer(playerX, playerY))).toEqual([2, 1]);
    });

    describe("should calculates overlap distance correctly", () => {
        it("should calculates without offset", () => {
            expect(Helpers.calculateOverlapDistance(25, 72, Enums.MoveDirections.RIGHT)).toBe(25);
        });

        it("should calculates with offeset", () => {
            expect(Helpers.calculateOverlapDistance(70, 72, Enums.MoveDirections.LEFT)).toBe(2);
        });
    });

    it("should calculates correct canvas width and height", () => {
        const width = Constants.GAME_RESOLUTION_TILE_LENGTH_X * Constants.GAME_RESOLUTION_TILE_SIZE;
        const height = Constants.GAME_RESOLUTION_TILE_LENGTH_Y * Constants.GAME_RESOLUTION_TILE_SIZE;
        expect(Helpers.calculateCanvasHeight()).toBe(height);
        expect(Helpers.calculateCanvasWidth()).toBe(width);
    });

    it("should makes deep copy correctly", () => {
        const object = {a: 1, b: { c: { d: 5} }};
        expect(Helpers.makeCopyObject(object)).toEqual(object);
    });

    it("should reterns random one bonus item from list correctly", () => {
        const randomItem = Helpers.chooseRandomBonusItem();
        const items = [
            Enums.EntityNumbers.ITEM_BOMB,
            Enums.EntityNumbers.ITEM_HEALTH,
            Enums.EntityNumbers.ITEM_RADIUS,
            Enums.EntityNumbers.ITEM_SPEED
        ];
        expect(items.includes(randomItem)).toBeTruthy();
    });

    it("should gets correct color of bomb by player color", () => {
        expect(Helpers.getBombIdByPlayerColor(Enums.PlayerColors.BLUE)).toBe(Enums.EntityNumbers.BOMB_BLUE);
        expect(Helpers.getBombIdByPlayerColor(Enums.PlayerColors.RED)).toBe(Enums.EntityNumbers.BOMB_RED);
        expect(Helpers.getBombIdByPlayerColor(Enums.PlayerColors.PURPLE)).toBe(Enums.EntityNumbers.BOMB_PURPLE);
        expect(Helpers.getBombIdByPlayerColor(Enums.PlayerColors.YELLOW)).toBe(Enums.EntityNumbers.BOMB_YELLOW);
    });

    it("should gets correct list of all ids bombs", () => {
        const bombs = [
            Enums.EntityNumbers.BOMB_YELLOW,
            Enums.EntityNumbers.BOMB_RED,
            Enums.EntityNumbers.BOMB_PURPLE,
            Enums.EntityNumbers.BOMB_BLUE
        ];
        expect(Helpers.getAllBombsIds()).toEqual(bombs);
    });

    it("should returns entities in a cell correctly", () => {
        const entities = [1, 2, 3];
        const map = [[[], [], entities]];
        expect(Helpers.getAllEntitiesInCell(map, 0, 2)).toEqual(entities);
    });
});