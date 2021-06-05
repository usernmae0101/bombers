import { Core, Enums, Constants } from "@bombers/shared/src/idnex";

describe("should creates maps correctly", () => {
    const map1 = Core.createMapById(Enums.GameMaps.MAP_1);  
    const map2 = Core.createMapById(Enums.GameMaps.MAP_2);  

    it("should have correct value of rows", () => {
        expect(map1.length).toBe(Constants.GAME_RESOLUTION_TILE_LENGTH_Y);
        expect(map2.length).toBe(Constants.GAME_RESOLUTION_TILE_LENGTH_Y);
    });

    it("should have correct value of cols", () => {
        expect(map1[0].length).toBe(Constants.GAME_RESOLUTION_TILE_LENGTH_X);
        expect(map2[0].length).toBe(Constants.GAME_RESOLUTION_TILE_LENGTH_X);
    });
});
