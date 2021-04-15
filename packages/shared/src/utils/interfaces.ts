export interface IGameStatePlayer {
    tick: number;
    x: number;
    y: number;
    speed: number;
    isMove: boolean;
    direction: number;
    toX?: number;
    toY?: number;
}

export interface IGameStatePlayers {
    [color: number]: IGameStatePlayer;
}

export interface IGameState {
    players: IGameStatePlayers;
    map: number[][][];
}

export interface IPredictBuffer {
    [tick: number]: {
        toX?: number;
        toY?: number;
        isLate?: boolean;
    };
}

export interface ISnapshotBuffer {
    [color: number]: {
        snapshots: ISnapshot[];
    }
}

export interface IOverlapData {
    row: number;
    col: number;
    entities: number[];
}

export interface ISnapshot {
    timestamp: number;
    changes: {
        x?: number;
        y?: number;
        direction?: number;
    };
}

export interface IBattleOptions {
    id: number;
}

export interface IServerBuffer {
    [tick: number]: {
        queue: { (): void }[];
    }
}

export interface IOnMessageData {
    author: string;
    avatar: string;
    message: string;
    data: number;
}

export interface IMoveInputsData {
    isMove: boolean;
    direction: number;
    tick: number;
}

export interface ISlot  {
    nickname: string;
    avatar: string;
    rating: number;
    isDisconnected?: boolean;
}

export interface ISlots {
    [color: number]: ISlot;
}

export interface IGameInitialData {
    color: number;
}

export interface IBattleJoinOptions {
    nickname: string;
    avatar: string;
    rating: number;
}

export interface IMovements {
    delayed: Array<{x: number; y: number}>;
    now: Array<{x: number; y: number}>;
}

export interface IStateChanges {
    x?: number;
    tick?: number;
    y?: number;
    direction?: number;
}