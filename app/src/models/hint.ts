export {};
const celestials = require("../databases/standard");

const PlanetX = 1;
const Dwarf = 2;
const Comet = 3;
const Asteroid = 4;
const GasCloud = 5;
const Empty = 6;

function hint_num(difficulty: string) {
    switch (difficulty) {
        case "easy":
            return 12;
        case "normal":
            return 8;
        case "hard":
            return 4;
        case "very-hard":
            return 0;
        default:
            return -1;
    }
}

function getCombinations<T>(array: T[], selectNumber: number): T[][] {
    const result: T[][] = [];

    // 종료 조건: 선택할 개수가 0일 경우 빈 배열을 반환 (조합에서 요소를 선택하지 않는 경우)
    if (selectNumber === 0) {
        return [[]];
    }

    // 배열을 순회하며 요소를 선택하고 재귀적으로 나머지 요소들로 조합을 생성
    array.forEach((current, index) => {
        const remaining = array.slice(index + 1); // 현재 요소를 제외한 나머지 배열
        const smallerCombinations = getCombinations(remaining, selectNumber - 1); // 나머지에서 조합 구하기
        const combined = smallerCombinations.map((combination) => [current, ...combination]); // 현재 요소를 앞에 추가
        result.push(...combined); // 결과에 추가
    });

    return result;
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

function choice(arr: number[][]) {
    return arr[getRandomInt(0, arr.length)];
}

function is_prime(num: number) {
    if ([2, 3, 5, 7, 11, 13, 17].includes(num)) return true;
    else return false;
}

function _select_hint(code: number, difficulty: string) {
    const num = hint_num(difficulty);
    const celestial = celestials[code];
    let hintSectors = choice(getCombinations([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0], num));
    let hints: Array<{ sector: number; obj: number }> = [];
    hintSectors.forEach((sector) => {
        let f = true;
        while (f) {
            const obj = getRandomInt(2, 6);
            if (obj == Comet && !is_prime(sector + 1)) continue;
            if (celestial[sector] != obj) {
                hints.push({
                    sector: sector,
                    obj: obj,
                });
                f = false;
            }
        }
    });
    console.log(hints);

    return { hints: hints };
}
export { _select_hint, getCombinations, getRandomInt };
