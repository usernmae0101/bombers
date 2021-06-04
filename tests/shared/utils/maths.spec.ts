import { Maths } from "@bombers/shared/src/idnex";

describe("maths should calculates correctly", () => {
    it("should interpolates correctly", () => {
        expect(Maths.lerp(0, 100, 0.1)).toBe(10);
    });

    it("should gets random integer between", () => {
        expect(Maths.getRandomBetween(100, 200)).toBeGreaterThanOrEqual(100);
        expect(Maths.getRandomBetween(100, 200)).toBeLessThanOrEqual(200);
    });
});