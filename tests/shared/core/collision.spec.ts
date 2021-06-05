import { Core, Helpers, Enums, Constants } from "@bombers/shared/src/idnex";
import { createPlayer } from "@bombers/game-server/src/core/game-state";

describe("collision should works correctly", () => {
    describe("overlap detenction should works correctly", () => {
        it("should detects when cell is not empty and moving left", () => {
            const startX = Constants.GAME_RESOLUTION_TILE_SIZE * 2;
            const player = createPlayer(startX, 0);
            const map = [
                [[], [1, 2, 3, 4], [], []]
            // player here --------^^
            ];
            player.x -= 2;
            player.direction = Enums.MoveDirections.LEFT;
            const expectData = [{ row: 0, col: 1, distance: 2 }, false];
            expect(Core.checkPlayerOverlap(player, map)).toEqual(expectData);
        });

        it("should detects when cell is not empty and moving up", () => {
            const startX = Constants.GAME_RESOLUTION_TILE_SIZE * 3;
            const startY = Constants.GAME_RESOLUTION_TILE_SIZE;
            const player = createPlayer(startX, startY);
            const map = [
                [[], [], [], [1, 2, 5]],
                [[], [], [], []],
            // player here --^^    
            ];
            player.y -= 2;
            player.direction = Enums.MoveDirections.UP;
            const expectData = [{ row: 0, col: 3, distance: 2 }, false];
            expect(Core.checkPlayerOverlap(player, map)).toEqual(expectData);
        });

        it("should not detects when cell is empty and moving bottom", () => {
            const startX = Constants.GAME_RESOLUTION_TILE_SIZE * 3;
            const player = createPlayer(startX, 0);
            const map = [
                [[], [], [], []],
            // player here --^^   
                [[], [], [], []], 
            ];
            player.y += 2;
            player.direction = Enums.MoveDirections.DOWN;
            const expectData = [undefined, false];
            expect(Core.checkPlayerOverlap(player, map)).toEqual(expectData);
        });

        it("should not detects when cell is empty and moving right", () => {
            const startX = Constants.GAME_RESOLUTION_TILE_SIZE * 3;
            const player = createPlayer(startX, 0);
            const map = [
                [[], [], [], [], []]
            // player here --^^
            ];
            player.x += 2;
            player.direction = Enums.MoveDirections.RIGHT;
            const expectData = [undefined, false];
            expect(Core.checkPlayerOverlap(player, map)).toEqual(expectData);
        });
    });

    describe("should detects when player out of canvas border", () => {
        const player = createPlayer(0, 0);

        beforeEach(() => {
            player.x = 0;
            player.y = 0;
        });

        it("should detects out by top", () => {
            player.y = -1;
            expect(Core.isOutOfBorder(player)).toBeTruthy();
        });

        it("should detects out by left", () => {
            player.x = -1;
            expect(Core.isOutOfBorder(player)).toBeTruthy();
        });

        it("should detects out by bottom", () => {
            player.y = Helpers.calculateCanvasHeight() + 1;
            expect(Core.isOutOfBorder(player)).toBeTruthy();
        });

        it("should detects out by right", () => {
            player.x = Helpers.calculateCanvasWidth() + 1;
            expect(Core.isOutOfBorder(player)).toBeTruthy();
        });

        it("should returns false when inside canvas", () => {
            expect(Core.isOutOfBorder(player)).toBeFalsy();
        });
    });

    describe("collision detection should works correctly", () => {
        it("should not detects if not collided entity", () => {
            expect(Core.isPlayerCollide([Enums.EntityNumbers.ITEM_RADIUS])).toBeFalsy();
        });

        it("should detects if collided entity", () => {
            expect(Core.isPlayerCollide([Enums.EntityNumbers.BOX])).toBeTruthy();
        });
    });
});
