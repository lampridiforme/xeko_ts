/**
 * Get random number
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param min 
 * @param max 
 * @param isInclusive If the max should also be included
 */
export function getRandomNumber(min: number, max: number, isInclusive: boolean = false) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + (isInclusive ? 1 : 0)) + min);
}