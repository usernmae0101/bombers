import { getRandomBetween } from "./../utils/maths";
import { debug } from "./debugger";

/**
 * Имитация сетевой задержки в режиме разработки.
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

    globalThis.setTimeout(
        () => send(), 
        ping
    );
};

/**
 * Имитация потери пакетов в режиме разработки.
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
    
    if (getRandomBetween(1, 100) <= percent) {
        debug("Drops UDP package", `percent: ${percent}`);
        return;
    }

    simulateLatency(ping, send);
};
