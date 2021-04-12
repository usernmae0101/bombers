import { normalizeMap, inverseMap, Cell } from "@bombers/shared/src/idnex";

describe("state-manager", () => {
    describe("map should be converted correctly", () => {
        const NORMALIZED_MAP = [
            [[1, 2], [0], [1, 3]],
            [[1], [2], [1, 1]],
            [[2], [], [0]]
        ];

        const INVERSED_MAP = [
            new Cell([1, 2]), new Cell([0]), new Cell([1, 3]),
            new Cell([1]), new Cell([2]), new Cell([1, 1]),
            new Cell([2]), new Cell([]), new Cell([0])
        ];

        it("map should be inversed correctly", () => {
            const result = inverseMap(NORMALIZED_MAP);
            expect(result).toEqual(INVERSED_MAP);
        });

        it("map should be normalized correctly", () => {
            const result = normalizeMap(INVERSED_MAP, NORMALIZED_MAP[0].length);
            expect(result).toEqual(NORMALIZED_MAP);
        });
    });
});