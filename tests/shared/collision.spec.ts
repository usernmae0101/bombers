import { Collision, Helpers, Enums, Constants } from "@bombers/shared/src/idnex";
import { createPlayer } from "@bombers/game-server/src/game-state";

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
            expect(Collision.checkPlayerOverlap(player, map)).toEqual(expectData);
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
            expect(Collision.checkPlayerOverlap(player, map)).toEqual(expectData);
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
            expect(Collision.checkPlayerOverlap(player, map)).toEqual(expectData);
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
            expect(Collision.checkPlayerOverlap(player, map)).toEqual(expectData);
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
            expect(Collision.isOutOfBorder(player)).toBeTruthy();
        });

        it("should detects out by left", () => {
            player.x = -1;
            expect(Collision.isOutOfBorder(player)).toBeTruthy();
        });

        it("should detects out by bottom", () => {
            player.y = Helpers.calculateCanvasHeight() + 1;
            expect(Collision.isOutOfBorder(player)).toBeTruthy();
        });

        it("should detects out by right", () => {
            player.x = Helpers.calculateCanvasWidth() + 1;
            expect(Collision.isOutOfBorder(player)).toBeTruthy();
        });

        it("should returns false when inside canvas", () => {
            expect(Collision.isOutOfBorder(player)).toBeFalsy();
        });
    });

    describe("collision detection should works correctly", () => {
        let map, od;

        beforeEach(() => {
            map = [[]];
            od = { row: 0, col: 0, distance: 0 };
        });

        it("should not detects if not collided entity", () => {
            map[0][0] = [Enums.EntityNumbers.ITEM_RADIUS];
            expect(Collision.isPlayerCollide(map, od, 0)).toBeFalsy();
        });

        it("should detects if collided entity", () => {
            map[0][0] = [Enums.EntityNumbers.BOX];
            expect(Collision.isPlayerCollide(map, od, 0)).toBeTruthy();
        });

        it("should not sliding on the bomb", () => {
            map[0][0] = [Enums.EntityNumbers.BOMB_RED];
            od.distance = 5;
            expect(Collision.isPlayerCollide(map, od, 5)).toBeTruthy();
        });

        it("should sliding on the bomb", () => {
            map[0][0] = [Enums.EntityNumbers.BOMB_RED];
            od.distance = 5;
            expect(Collision.isPlayerCollide(map, od, 4)).toBeFalsy();
        });
    });
});
