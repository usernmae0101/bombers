import { Maths } from "@bombers/shared/src/idnex";

describe("maths should calculates correctly", () => {
    it("should interpolates correctly", () => {
        expect(Maths.lerp(0, 100, 0.1)).toBe(10);
    });

    it("should gets random integer between", () => {
        expect(Maths.getRandomBetween(100, 200)).toBeGreaterThanOrEqual(100);
        expect(Maths.getRandomBetween(100, 200)).toBeLessThanOrEqual(200);
    });

    describe("getDistance", () => {
        let x1, x2, y1, y2;

        beforeEach(() => {
            x1 = 72;
            x2 = 72;
            y1 = 72;
            y2 = 72;
        });

        it("calculates right", () => {
            x2 = 2;
            const distanceHypo = Maths.getDistanceHypot(x1, x2, y1, y2);
            const distanceSqrt = Maths.getDistanceSqrt(x1, x2, y1, y2);
            expect(distanceHypo).toBe(70);
            expect(distanceSqrt).toBe(70);
        });

        it("calculates left", () => {
            x2 = 142;
            const distanceHypo = Maths.getDistanceHypot(x1, x2, y1, y2);
            const distanceSqrt = Maths.getDistanceSqrt(x1, x2, y1, y2);
            expect(distanceHypo).toBe(70);
            expect(distanceSqrt).toBe(70);
        });

        it("calculates up", () => {
            y2 = 142;
            const distanceHypo = Maths.getDistanceHypot(x1, x2, y1, y2);
            const distanceSqrt = Maths.getDistanceSqrt(x1, x2, y1, y2);
            expect(distanceHypo).toBe(70);
            expect(distanceSqrt).toBe(70);
        });

        it("calculates down", () => {
            y2 = 2;
            const distanceHypo = Maths.getDistanceHypot(x1, x2, y1, y2);
            const distanceSqrt = Maths.getDistanceSqrt(x1, x2, y1, y2);
            expect(distanceHypo).toBe(70);
            expect(distanceSqrt).toBe(70);
        });
    
        it("calculates middle", () => {
            const distanceHypo = Maths.getDistanceHypot(x1, x2, y1, y2);
            const distanceSqrt = Maths.getDistanceSqrt(x1, x2, y1, y2);
            expect(distanceHypo).toBe(0);
            expect(distanceSqrt).toBe(0);
        });
    });
});
