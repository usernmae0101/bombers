import { createPlayer } from "@bombers/game-server/src/core/game-state";
import * as common from "@bombers/shared/src/core";
import { Constants, Enums } from "@bombers/shared/src/idnex";

describe("common module should works correctly", () => {
    describe("should filters overlap corretly", () => {
        const map = [[[]]];
        const player = createPlayer(0, 0);
        const state = { map, players: { [1]: player } };
        const overlapData = { row: 0, col: 0, distance: Constants.GAME_RESOLUTION_TILE_OFFSET * 3 };

        it("should damages player", () => {
            map[0][0] = [Enums.EntityNumbers.FIRE_CENTER];
            player.health = 3;
            common.filterOverlapData(overlapData, state, 1, {});
            expect(player.health).toBe(2);
        });

        it("should not damages player", () => {
            map[0][0] = [Enums.EntityNumbers.FIRE_CENTER];
            player.health = 3;
            overlapData.distance = Constants.GAME_RESOLUTION_TILE_OFFSET;
            common.filterOverlapData(overlapData, state, 1, {});
            expect(player.health).toBe(3);
        });
    });
});