/**
 * Функция линейной интерполяции (нахождние промежуточного 
 * значения между двумя точками).
 * 
 * @param from - точка-начало
 * @param to точка-конец
 * @param ratio - коэффициент (от 0.0 до 1.0)
 * @returns промежуточное значение 
 */
export function lerp(from: number, to: number, ratio: number): number {
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
export function getRandomBetween(min: number, max: number): number {
    return Math.floor(Math.random( ) * (max - min + 1)) + min;
}
