const celestials = require("../databases/standard");

const PlanetX = 1;
const Dwarf = 2;
const Comet = 3;
const Asteroid = 4;
const GasCloud = 5;
const Empty = 6;

function hint_num(difficulty) {
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
            alert("잘못된 difficulty값입니다.");
    }
}

function combination(arr, selectNum) {
    const result = [];
    if (selectNum === 1) return arr.map((v) => [v]);
    arr.forEach((v, idx, arr) => {
        const fixed = v;
        const restArr = arr.slice(idx + 1);
        const combinationArr = combination(restArr, selectNum - 1);
        const combineFix = combinationArr.map((v) => [fixed, ...v]);
        result.push(...combineFix);
    });
    return result;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function choice(arr) {
    return arr[getRandomInt(0, arr.length)];
}

function is_prime(num) {
    if ([2, 3, 5, 7, 11, 13, 17].includes(num)) return true;
    else return false;
}

function select_hint(code, difficulty) {
    num = hint_num(difficulty);
    const celestial = celestials[code];
    let hintSectors = choice(combination([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], num));
    let hints = [];
    hintSectors.forEach((sector) => {
        let f = true;
        while (f) {
            obj = getRandomInt(2, 6);
            if (obj == Comet && !is_prime(sector)) continue;
            if (celestial[sector] != obj) {
                hints.push({
                    sector: sector,
                    obj: obj,
                });
                f = false;
            }
        }
    });
    // console.log(code);
    return { hints };
}

module.exports = { select_hint };
