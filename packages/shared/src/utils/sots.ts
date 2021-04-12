import { ISlot, ISlots, PlayerColors } from "@bombers/shared/src/idnex";

export const emptySlot: ISlot = {
    nickname: null,
    avatar: null,
    rating: null,
    isDisconnected: false
};

export const slots: ISlots = {
    [PlayerColors.PURPLE]: emptySlot,
    [PlayerColors.RED]: emptySlot,
    [PlayerColors.YELLOW]: emptySlot,
    [PlayerColors.BLUE]: emptySlot,
};