import { getRandomBetween } from "./../utils/maths";

/**
 * Имитация сетевой задержки.
 * 
 * @param ping - сетевая задержка в млсек.
 * @param send - пакет
 */
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

/**
 * Имитация потери пакетов.
 *
 * @param percent - процент потери
 * @param ping - сетевая задержка в млсек.
 * @param send - пакет
 */
export const simulatePackageLoss = (
    percent: number,
    ping: number,
    send: () => void
) => {
    if (process.env.NODE_ENV !== "development") {
        send();
        return;
    }

    if (getRandomBetween(1, 100) > percent) 
        simulateLatency(ping, send);
};
