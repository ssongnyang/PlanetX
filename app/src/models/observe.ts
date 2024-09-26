export {};
const celestials: number[][] = require("../databases/standard");
const { getCombinations, choice } = require("./hint");

const PlanetX = 1;
const Dwarf = 2;
const Comet = 3;
const Asteroid = 4;
const GasCloud = 5;
const Empty = 6;

function count(list: number[], object: number) {
    return list.reduce((cnt, element) => {
        if (element == object) {
            return cnt + 1;
        } else {
            return cnt;
        }
    }, 0);
}

function _observe(code: number, object: number, start: number, end: number) {
    let range: number[];
    const celestial: number[] = celestials[code];
    if (start <= end) {
        range = celestial.slice(start, end + 1);
    } else {
        const first = celestial.slice(start);
        const second = celestial.slice(0, end + 1);
        range = first.concat(second);
    }
    return count(range, object);
}
//     [6, 5, 3, 1, 4, 4, 3, 6, 5, 2, 4, 4],
export { _observe };
