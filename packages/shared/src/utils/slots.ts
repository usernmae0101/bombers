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

const { makeCopyObject } = Shared.Helpers;

/**
 * Четыре игровых слота, отдельный для каждого цвета.
 */
export const slots: Shared.Interfaces.IGameSlots = {
    [Shared.Enums.PlayerColors.PURPLE]: makeCopyObject(emptySlot),
    [Shared.Enums.PlayerColors.RED]: makeCopyObject(emptySlot),
    [Shared.Enums.PlayerColors.YELLOW]: makeCopyObject(emptySlot),
    [Shared.Enums.PlayerColors.BLUE]: makeCopyObject(emptySlot),
};
