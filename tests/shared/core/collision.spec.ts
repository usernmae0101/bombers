import { Core, Helpers, Enums, Constants } from "@bombers/shared/src/idnex";
import { createPlayer } from "@bombers/game-server/src/core/game-state";

describe("collision should works correctly", () => {
    describe("overlap detenction should works correctly", () => {
        it("should works when moving left", () => {
            const statrtX = Constants.GAME_RESOLUTION_TILE_SIZE * 2;
            const player = createPlayer(statrtX, 0);
            const map = [
                [[], [1, 2, 3, 4], [], []]
            // player here --------^^
            ];
            player.x -= 2;
            player.direction = Enums.MoveDirections.LEFT;
            const expectData = [{ row: 0, col: 1, distance: 2 }, false];
            expect(Core.checkPlayerOverlap(player, map)).toEqual(expectData);
        });

        it("should works when moving bottom", () => {
            const statrtX = Constants.GAME_RESOLUTION_TILE_SIZE * 3;
            const player = createPlayer(statrtX, 0);
            const map = [
                [[], [], [], []],
            // palyer here --^^    
                [[], [], [], [1, 2, 5]]
            ];
            player.y += 2;
            player.direction = Enums.MoveDirections.DOWN;
            const expectData = [{ row: 1, col: 3, distance: 2 }, false];
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
