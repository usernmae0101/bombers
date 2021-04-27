import { GAME_RESOLUTION_TILE_SIZE } from "./../idnex";
import { EntityNumbers, MoveDirections, PlayerColors } from "./../idnex";

export const getEntityFrame = (entity: number, color?: number, direction?: number): { x: number, y: number } => {
    if([
        EntityNumbers.FIRE_TOP,
        EntityNumbers.FIRE_BOTTOM,
        EntityNumbers.FIRE_LEFT,
        EntityNumbers.FIRE_RIGHT,
    ].includes(entity)) return frames.static[EntityNumbers.FIRE_EDGE];
    
    if ([
        EntityNumbers.FIRE_MIDDLE_X,
        EntityNumbers.FIRE_MIDDLE_Y
    ].includes(entity)) return frames.static[EntityNumbers.FIRE_CENTER];

    switch (entity) {
        case EntityNumbers.PLAYER:
            return frames.dynamic.player[color][direction];
        default: return frames.static[entity];
    }
};

interface IInitialPlayerState {
    direction: number;
    x: number;
    y: number;
}

export const getInitialPlayerState = (color: number): IInitialPlayerState => {
    switch (color) {
        case PlayerColors.YELLOW:
            return {
                x: 0,
                y: 10 * GAME_RESOLUTION_TILE_SIZE,
                direction: MoveDirections.DOWN
            };
        case PlayerColors.RED:
            return {
                x: 0,
                y: 0,
                direction: MoveDirections.DOWN
            };
        case PlayerColors.PURPLE:
            return {
                x: 16 * GAME_RESOLUTION_TILE_SIZE,
                y: 10 * GAME_RESOLUTION_TILE_SIZE,
                direction: MoveDirections.DOWN
            };
        case PlayerColors.BLUE:
            return {
                x: 16 * GAME_RESOLUTION_TILE_SIZE,
                y: 0,
                direction: MoveDirections.DOWN
            };
    }
};

export const getBombByThePlayersColor = (color: number): number => {
    switch(color) {
        case PlayerColors.BLUE:
            return EntityNumbers.BOMB_BLUE;
        case PlayerColors.PURPLE:
            return EntityNumbers.BOMB_PURPLE;
        case PlayerColors.RED:
            return EntityNumbers.BOMB_RED;
        case PlayerColors.YELLOW:
            return EntityNumbers.BOMB_YELLOW;
    }
};

export const COLORS = [
    PlayerColors.BLUE, PlayerColors.PURPLE,
    PlayerColors.RED, PlayerColors.YELLOW
];

interface IFrames {
    static: {
        [color: number]: {
            x: number;
            y: number;
        }
    },
    dynamic: {
        player: {
            [color: number]: {
                [direction: number]: {
                    x: number;
                    y: number;
                }
            }
        }
    }
}

const frames: IFrames = {
    static: {
        [EntityNumbers.CRATER]: {
            x: 0,
            y: 5 * GAME_RESOLUTION_TILE_SIZE
        },
        [EntityNumbers.BOX]: {
            x: 2 * GAME_RESOLUTION_TILE_SIZE,
            y: 4 * GAME_RESOLUTION_TILE_SIZE
        },
        [EntityNumbers.ROCK]: {
            x: 3 * GAME_RESOLUTION_TILE_SIZE,
            y: 4 * GAME_RESOLUTION_TILE_SIZE
        },
        [EntityNumbers.BOMB_BLUE]: {
            x: 4 * GAME_RESOLUTION_TILE_SIZE,
            y: 1 * GAME_RESOLUTION_TILE_SIZE
        },
        [EntityNumbers.BOMB_PURPLE]: {
            x: 4 * GAME_RESOLUTION_TILE_SIZE,
            y: 2 * GAME_RESOLUTION_TILE_SIZE
        },
        [EntityNumbers.BOMB_RED]: {
            x: 4 * GAME_RESOLUTION_TILE_SIZE,
            y: 0
        },
        [EntityNumbers.BOMB_YELLOW]: {
            x: 4 * GAME_RESOLUTION_TILE_SIZE,
            y: 3 * GAME_RESOLUTION_TILE_SIZE
        },
        [EntityNumbers.ITEM_BOMB]: {
            x: 4 * GAME_RESOLUTION_TILE_SIZE,
            y: 5 * GAME_RESOLUTION_TILE_SIZE
        },
        [EntityNumbers.ITEM_RADIUS]: {
            x: 2 * GAME_RESOLUTION_TILE_SIZE,
            y: 5 * GAME_RESOLUTION_TILE_SIZE
        },
        [EntityNumbers.ITEM_SPEED]: {
            x: 3 * GAME_RESOLUTION_TILE_SIZE,
            y: 5 * GAME_RESOLUTION_TILE_SIZE
        },
        [EntityNumbers.ITEM_HEALTH]: {
            x: 1 * GAME_RESOLUTION_TILE_SIZE,
            y: 5 * GAME_RESOLUTION_TILE_SIZE
        },
        [EntityNumbers.FIRE_CENTER]: {
            x: 0,
            y: 4 * GAME_RESOLUTION_TILE_SIZE
        },
        [EntityNumbers.FIRE_EDGE]: {
            x: 1 * GAME_RESOLUTION_TILE_SIZE,
            y: 4 * GAME_RESOLUTION_TILE_SIZE
        }
    },
    dynamic: {
        player: {
            [PlayerColors.BLUE]: {
                [MoveDirections.DOWN]: {
                    x: 2 * GAME_RESOLUTION_TILE_SIZE,
                    y: 1 * GAME_RESOLUTION_TILE_SIZE
                },
                [MoveDirections.UP]: {
                    x: 0,
                    y: 1 * GAME_RESOLUTION_TILE_SIZE
                },
                [MoveDirections.RIGHT]: {
                    x: 1 * GAME_RESOLUTION_TILE_SIZE,
                    y: 1 * GAME_RESOLUTION_TILE_SIZE
                },
                [MoveDirections.LEFT]: {
                    x: 3 * GAME_RESOLUTION_TILE_SIZE,
                    y: 1 * GAME_RESOLUTION_TILE_SIZE
                }
            },
            [PlayerColors.YELLOW]: {
                [MoveDirections.DOWN]: {
                    x: 2 * GAME_RESOLUTION_TILE_SIZE,
                    y: 3 * GAME_RESOLUTION_TILE_SIZE
                },
                [MoveDirections.UP]: {
                    x: 0,
                    y: 3 * GAME_RESOLUTION_TILE_SIZE
                },
                [MoveDirections.RIGHT]: {
                    x: 1 * GAME_RESOLUTION_TILE_SIZE,
                    y: 3 * GAME_RESOLUTION_TILE_SIZE
                },
                [MoveDirections.LEFT]: {
                    x: 3 * GAME_RESOLUTION_TILE_SIZE,
                    y: 3 * GAME_RESOLUTION_TILE_SIZE
                }
            },
            [PlayerColors.PURPLE]: {
                [MoveDirections.DOWN]: {
                    x: 2 * GAME_RESOLUTION_TILE_SIZE,
                    y: 2 * GAME_RESOLUTION_TILE_SIZE
                },
                [MoveDirections.UP]: {
                    x: 0,
                    y: 2 * GAME_RESOLUTION_TILE_SIZE
                },
                [MoveDirections.RIGHT]: {
                    x: 1 * GAME_RESOLUTION_TILE_SIZE,
                    y: 2 * GAME_RESOLUTION_TILE_SIZE
                },
                [MoveDirections.LEFT]: {
                    x: 3 * GAME_RESOLUTION_TILE_SIZE,
                    y: 2 * GAME_RESOLUTION_TILE_SIZE
                }
            },
            [PlayerColors.RED]: {
                [MoveDirections.DOWN]: {
                    x: 2 * GAME_RESOLUTION_TILE_SIZE,
                    y: 0
                },
                [MoveDirections.UP]: {
                    x: 0,
                    y: 0
                },
                [MoveDirections.RIGHT]: {
                    x: 1 * GAME_RESOLUTION_TILE_SIZE,
                    y: 0
                },
                [MoveDirections.LEFT]: {
                    x: 3 * GAME_RESOLUTION_TILE_SIZE,
                    y: 0
                }
            }
        }
    },
}