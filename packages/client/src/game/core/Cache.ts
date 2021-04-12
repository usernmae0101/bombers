interface ICachePlayer {
    [color: number]: {
        direction: number;
        x: number;
        y: number;
    }
}

interface ICacheState {
    isMove?: boolean;
    direction?: number;
}

export default class Cache {
    static player: ICachePlayer = {};

    static state: ICacheState = {}
}