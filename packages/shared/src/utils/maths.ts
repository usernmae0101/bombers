/**
 * Функция линейной интерполяции (нахождние
 * промежуточного значения между двумя точками).
 * 
 * @param from - точка-начало
 * @param to точка-конец
 * @param ratio - коэффициент (от 0.0 до 1.0)
 * @returns помежуточное значение
 */
export function lerp(from: number, to: number, ratio: number): number {
    return from + (to - from) * ratio;
};