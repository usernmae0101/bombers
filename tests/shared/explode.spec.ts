import { detonateBomb } from "@bombers/shared/src/explode";
import { createState } from "@bombers/game-server/src/game-state";
import * as Shared from "@bombers/shared/src/idnex";
import PlayerFactory from "@bombers/game-server/src/PlayerFactory";

describe("explode.ts", () => {
    describe("damages after bomb exploded", () => {
        let state: Shared.Interfaces.IGameState;

        beforeEach(() => {
            state = createState(
                Shared.Maps.createMapById(Shared.Enums.GameMaps.MAP_1)
            ); 
            state.players[0] = PlayerFactory.create(0);
            state.players[1] = PlayerFactory.create(1);

            // удаляем камни и корбки ----->
            for (let col = 2; col < 6; col++) {
                state.map[2][col] = [];
            }
        });

        it("should damages if takes full cell", () => {
            state.players[0].x = 2 * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
            state.players[0].y = 2 * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
            detonateBomb([2, 2], state, 2, () => {});
            expect(state.players[0].health).toBe(2);
        });

        it("should damages if takes age of cell", () => {
            state.players[0].x = 5 * Shared.Constants.GAME_RESOLUTION_TILE_SIZE - 10;
            state.players[0].y = 2 * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
            detonateBomb([2, 2], state, 2, () => {});
            expect(state.players[0].health).toBe(2);
        });

        it("should not damages beacause of offset", () => {
            state.players[0].x = 5 * Shared.Constants.GAME_RESOLUTION_TILE_SIZE - 1;
            state.players[0].y = 2 * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
            detonateBomb([2, 2], state, 2, () => {});
            expect(state.players[0].health).toBe(3);
        });

        it("should not damage if one player alive", () => {
            delete state.players[1];
            state.players[0].x = 2 * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
            state.players[0].y = 2 * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
            detonateBomb([2, 2], state, 2, () => {});
            expect(state.players[0].health).toBe(3);
        });

        it("should not damages because of range", () => {
            state.players[0].x = 3 * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
            state.players[0].y = 3 * Shared.Constants.GAME_RESOLUTION_TILE_SIZE;
            detonateBomb([2, 2], state, 2, () => {});
            expect(state.players[0].health).toBe(3);
        });
    });
});
