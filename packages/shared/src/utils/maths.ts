export function lerp(from: number, to: number, alpha: number): number {
    return from + (to - from) * alpha;
};