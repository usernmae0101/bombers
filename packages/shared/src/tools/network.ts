import { getRandomBetween } from "./../utils/maths";

export const simulateLatency = async (
    ping: number,
    send: () => void
) => {
    if (process.env.NODE_ENV !== "development") {
        send();
        return;
    }

    globalThis.setTimeout(() => send(), ping);
};

export const simulatePackageLoss = (
    percent: number,
    ping: number,
    send: () => void
) => {
    if (process.env.NODE_ENV !== "development") {
        send();
        return;
    }

    if (getRandomBetween(0, 100) > percent) 
        simulateLatency(ping, send);
};
