import { Cell, detectOverlap, GAME_RESOLUTION_TILE_SIZE, IOverlapData, IPlayer, MoveDirections } from "@bombers/shared/src/idnex";

describe("collision", () => {
    describe("overlap detection should be detected correctly", () => {
        let overlapDataServer: IOverlapData[], overlapDataClient: IOverlapData[];
        
        const player: IPlayer = {
            x: GAME_RESOLUTION_TILE_SIZE * 2,
            y: GAME_RESOLUTION_TILE_SIZE * 2,
            direction: null
        };

        const clinetMap: number[][][] = [
            [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [], [2], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [3], [], [1], [], [], [], [], [], [], [], [], [], [], [], [], []],
            [[], [], [1, 2, 3], [], [], [], [], [], [], [], [], [], [], [], [], [], []],
        ];

        const serverMap: Cell[] = [];

        for (let row = 0; row < clinetMap.length; row++) {
            for (let col = 0; col < clinetMap[row].length; col++) {
                serverMap.push(new Cell(clinetMap[row][col]));
            }
        }

        const setOverlapData = (player: IPlayer) => {
            overlapDataServer = detectOverlap(player, serverMap);
            overlapDataClient = detectOverlap(player, clinetMap);
        };

        test("overlap detection by top should finds [2] in a row 1 and col 2", () => {
            player.direction = MoveDirections.UP;
            player.y -= 4;

            setOverlapData(player);

            expect(overlapDataServer).toEqual([{row: 1, col: 2, entities: [2]}]);
            expect(overlapDataClient).toEqual([{row: 1, col: 2, entities: [2]}]);
        });

        test("overlap detection by bottom should finds [1, 2, 3] in a row 3 and col 2", () => {
            player.direction = MoveDirections.DOWN;
            player.y += 4;

            setOverlapData(player);

            expect(overlapDataServer).toEqual([{row: 3, col: 2, entities: [1, 2, 3]}]);
            expect(overlapDataClient).toEqual([{row: 3, col: 2, entities: [1, 2, 3]}]);
        });

        test("overlap detection by right should finds [1] in a row 2 and col 3", () => {
            player.direction = MoveDirections.RIGHT;
            player.x += 4;

            setOverlapData(player);

            expect(overlapDataServer).toEqual([{row: 2, col: 3, entities: [1]}]);
            expect(overlapDataClient).toEqual([{row: 2, col: 3, entities: [1]}]);
        });

        test("overlap detection by left should finds [3] in a row 2 and col 1", () => {
            player.direction = MoveDirections.LEFT;
            player.x -= 4;

            setOverlapData(player);

            expect(overlapDataServer).toEqual([{row: 2, col: 1, entities: [3]}]);
            expect(overlapDataClient).toEqual([{row: 2, col: 1, entities: [3]}]);
        });
    });
});