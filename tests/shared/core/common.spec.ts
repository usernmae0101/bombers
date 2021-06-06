import { createPlayer } from "@bombers/game-server/src/core/game-state";
import * as common from "@bombers/shared/src/core";
import { Constants, Enums, Interfaces } from "@bombers/shared/src/idnex";

describe("common module should works correctly", () => {
    describe("should filters overlap correctly", () => {
        const map = [[[]]];
        const state = { map, players: {} };
        const overlapData = { row: 0, col: 0, distance: 0 };
        let player: Interfaces.IGameStatePlayer;

        beforeEach(() => {
            overlapData.distance = Constants.GAME_RESOLUTION_TILE_OFFSET * 3;
            state.players[1] = createPlayer(0, 0);
            player = state.players[1];
        });

        describe("should filters with fire corretly", () => {
            beforeEach(() => {
                map[0][0] = [Enums.EntityNumbers.FIRE_CENTER];
                jest.useFakeTimers();
            });

            it("should damages player", () => {
                common.filterOverlapData(overlapData, state, 1, {});
                expect(player.health).toBe(2);
            });

            it("should not damages player because of distance", () => {
                overlapData.distance = Constants.GAME_RESOLUTION_TILE_OFFSET;
                common.filterOverlapData(overlapData, state, 1, {});
                expect(player.health).toBe(3);
            });

            it("should kills player", () => {
                player.health = 1;
                player.isImmortal = false;
                common.filterOverlapData(overlapData, state, 1, {});
                expect(1 in state.players).toBeFalsy();
            });

            it("should makes immortal/unimmirtal player", () => {
                player.isImmortal = false;
                common.filterOverlapData(overlapData, state, 1, {});
                expect(player.isImmortal).toBeTruthy();
                jest.runAllTimers();
                jest.advanceTimersByTime(Constants.GAME_GAMEPLAY_PLAYER_IMMORTAL_INTERVAL + 100);
                expect(player.isImmortal).toBeFalsy();
            });
        });

        describe("should filters with bonus items correctly", () => {
            it("should picks up bomb item", ()=> {
                player.bombs = 3;
                map[0][0] = [Enums.EntityNumbers.ITEM_BOMB];
                common.filterOverlapData(overlapData, state, 1, {1: 3});
                expect(player.bombs).toBe(4);
            });

            it("should picks up speed item", () => {
                player.speed = 2;
                map[0][0] = [Enums.EntityNumbers.ITEM_SPEED];
                common.filterOverlapData(overlapData, state, 1, {});
                expect(player.speed).toBe(3);
            });

            it("should picks up radius item", () => {
                player.radius = 4;
                map[0][0] = [Enums.EntityNumbers.ITEM_RADIUS];
                common.filterOverlapData(overlapData, state, 1, {});
                expect(player.radius).toBe(5);
            });

            it("should picks up health item", () => {
                player.health = 2;
                map[0][0] = [Enums.EntityNumbers.ITEM_HEALTH];
                common.filterOverlapData(overlapData, state, 1, {});
                expect(player.health).toBe(3);
            });

            it("should destroys bonus item from map after overlap", () => {
                map[0][0] = [Enums.EntityNumbers.ITEM_RADIUS];
                common.filterOverlapData(overlapData, state, 1, {});
                expect(map[0][0]).toHaveLength(0);
            });
        });
    });
});