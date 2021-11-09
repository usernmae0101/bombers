/**
 * Функция линейной интерполяции (нахождние промежуточного 
 * значения между двумя точками).
 * 
 * @param from - точка-начало
 * @param to точка-конец
 * @param ratio - коэффициент (от 0.0 до 1.0)
 * @returns промежуточное значение 
 */
export function lerp(
    from: number, 
    to: number, 
    ratio: number
): number {
    return from + (to - from) * ratio;
}

/**
 * Получает случайное целое число в диапазоне от
 * минимума до максимума, включая минимум и максимум.
 * 
 * @param min - минимум
 * @param max - максимум
 * @returns целое число 
 */
export function getRandomBetween(
    min: number, 
    max: number
): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Высчитывает дистанцию между двумя точками. Подходит
 * для очень маленьких или слишком больших значений.
 */
export function getDistanceHypot(
    x1: number,
    x2: number,
    y1: number,
    y2: number
): number {
    return Math.hypot(x1 - x2, y1 - y2);
};

/**
 * Высчитывает дистанцию между двумя точками. Работает
 * быстрее, чем Math.hypot(...).
 */
export function getDistanceSqrt(
    x1: number,
    x2: number,
    y1: number,
    y2: number
): number {
    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
};
