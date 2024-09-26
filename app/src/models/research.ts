export {};
const assert = require("assert");
const celestials = require("../databases/standard");
const { getCombinations, getRandomInt } = require("./hint");

const PlanetX = 1;
const Dwarf = 2;
const Comet = 3;
const Asteroid = 4;
const GasCloud = 5;
const Empty = 6;

let celestial: number[];

function _select_research(code: number) {
    celestial = celestials[code];
    const researchTopic6 = choice<number[][]>(getCombinations(researchTopics, 6));
    researchTopic6.forEach((researchTopic) => {
        if (researchTopic[0] == researchTopic[1]) {
            const researchType = choice([researchTypes.adjacent, researchTypes.opposite, researchTypes.band]);
            console.log(researchTopic, researchType(researchTopic));
        } else {
            const researchType = choice([researchTypes.adjacent, researchTypes.opposite, researchTypes.range]);
            console.log(researchTopic, researchType(researchTopic));
        }
    });
}

function count(object: number) {
    switch (object) {
        case PlanetX:
            return 1;
        case Dwarf:
            return 1;
        case Comet:
            return 2;
        case Asteroid:
            return 4;
        case GasCloud:
            return 2;
        case Empty:
            return 2;
    }
}
function indexes(object: number) {
    let result: number[] = [];
    for (let i = 0; i < 12; i++) {
        if (celestial[i] == object) {
            result.push(i);
        }
    }
    return result;
}
function left(sector: number) {
    return celestial[(sector + 11) % 12];
}
function right(sector: number) {
    return celestial[(sector + 1) % 12];
}
function adjacent(sector: number) {
    return [celestial[(sector + 1) % 12], celestial[(sector + 11) % 12]];
}
function opposite(sector: number) {
    return celestial[sector + (6 % 12)];
}
function range(sector: number, range: number) {
    let result: number[] = [celestial[sector]];
    for (let i = 0; i < range; i++) {
        result.push(left((sector + i + 11) % 12));
        result.push(right((sector + i + 1) % 12));
    }
    result.sort();
    return result;
}

function shuffle(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function choice<T>(array: Array<T>): T {
    return array[getRandomInt(0, array.length)];
}
const researchTopics = [
    [Dwarf, Comet],
    [Dwarf, Asteroid],
    [Dwarf, GasCloud],
    [Dwarf, Empty],
    [Comet, Comet],
    [Comet, Asteroid],
    [Comet, GasCloud],
    [Comet, Empty],
    [Asteroid, Asteroid],
    [Asteroid, GasCloud],
    [Asteroid, Empty],
    [GasCloud, GasCloud],
    [GasCloud, Empty],
];
const researchTypes = {
    adjacent: (objList: number[]) => {
        shuffle(objList);
        const obj1 = objList[0];
        const obj2 = objList[1];
        const cnt = indexes(obj1).reduce((cnt: number, idx: number) => {
            if (adjacent(idx).includes(obj2)) {
                cnt += 1;
            }
            return cnt;
        }, 0);
        if (cnt == count(obj1)) {
            return { result: true, type: "all" };
        } else if (cnt == 0) {
            return { result: false, type: "all" };
        } else {
            return { result: true, type: "at-least-one" };
        }
    },
    opposite: (objList: number[]) => {
        shuffle(objList);
        const obj1 = objList[0];
        const obj2 = objList[1];
        const cnt = indexes(obj1).reduce((cnt: number, idx: number) => {
            if (opposite(idx) == obj2) {
                cnt += 1;
            }
            return cnt;
        }, 0);
        if (cnt == count(obj1)) {
            return { result: true, type: "all" };
        } else if (cnt == 0) {
            return { result: false, type: "all" };
        } else {
            return { result: true, type: "at-least-one" };
        }
    },
    range: (objList: number[]) => {
        shuffle(objList);
        const obj1 = objList[0];
        const obj2 = objList[1];
        let distances: number[] = [];
        indexes(obj1).forEach((sector) => {
            for (let i = 1; i < 6; i++) {
                if (range(sector, i).includes(obj2)) {
                    distances.push(i);
                    break;
                }
            }
        });
        const maxDistance = Math.max(...distances);
        const minDistance = Math.min(...distances);
        return {
            atLeast: minDistance,
            all: maxDistance,
        };
    },
    band: (objList: number[]) => {
        assert(objList[0] == objList[1]);
        const object = objList[0];
        const sectors = indexes(object);
        if (object == Asteroid) {
            const distances = [
                sectors[1] - sectors[0],
                sectors[2] - sectors[1],
                sectors[3] - sectors[2],
                12 - sectors[3] + sectors[0],
                8,
            ];
            return Math.min(...distances);
        } else {
            const distance = sectors[1] - sectors[0];
            if (distance < 6) {
                return distance + 1;
            } else {
                return 12 - distance + 1;
            }
        }
    },
};
module.exports = { _select_research };
