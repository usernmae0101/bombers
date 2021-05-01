import * as Shared from "@bombers/shared/src/idnex";

/**
 * Пустой игровой слот.
 */
export const emptySlot: Shared.Interfaces.IGameSlot = {
    user: {
        nickname: null,
        avatar: null,
        rating: null,
    },
    isReady: false,
    isDisconnected: false
};

/**
 * Четыре игровых слота, отдельный для каждого цвета.
 */
export const slots: Shared.Interfaces.IGameSlots = {
    [Shared.Enums.PlayerColors.PURPLE]: emptySlot,
    [Shared.Enums.PlayerColors.RED]: emptySlot,
    [Shared.Enums.PlayerColors.YELLOW]: emptySlot,
    [Shared.Enums.PlayerColors.BLUE]: emptySlot,
};
