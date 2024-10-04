export {};
const assert = require("assert");
const { spawn } = require("child_process");
const celestials: { standard: number[][] } = require("../databases/celestials.json");
const { getCombinations, getRandomInt } = require("./hint");

const PlanetX = 1;
const Dwarf = 2;
const Comet = 3;
const Asteroid = 4;
const GasCloud = 5;
const Empty = 6;

let celestial: number[];

interface research {
    topic: number[];
    topicString: string;
    condition: object | number;
}

function _select_research(code: number) {
    celestial = celestials.standard[code];
    let result: research[] = [];
    let topics = shuffle(researchTopics);
    // const researchTopic6 = choice<number[][]>(getCombinations(researchTopics, 6));
    topics.some((topic) => {
        topic = shuffle(topic);
        let types: Function[] = shuffle(researchTypes);
        types.some((type) => {
            let researchResult: result = type(topic);
            if (researchResult.name == "range") {
                const range = spawn("python", [
                    "app/src/models/range.py",
                    JSON.stringify(topic),
                    JSON.stringify(researchResult),
                ]);
                range.stdout.on("data", (data: any) => {
                    console.log(data.toString());
                    researchResult = JSON.parse(data.toString());
                });
                range.stderr.on("data", (data: any) => {
                    console.log(data.toString());
                });
            }
            if (validResearch(topic, researchResult)) {
                result.push({
                    topic: topic,
                    topicString: topicToString(topic),
                    condition: researchResult,
                });
                return true;
            }
        });

        if (result.length == 6) {
            return true;
        }
    });
    return { researches: result };
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
    return celestial[(sector + 6) % 12];
}
function range(sector: number, range: number) {
    let result: number[] = [];
    for (let i = 0; i < range; i++) {
        result.push(left((sector - i + 12) % 12));
        result.push(right((sector + i) % 12));
    }
    // result.sort();
    return result;
}

function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
    // assert(array.length == 2);
    // if (Math.random() < 0.5) {
    //     return array;
    // } else {
    //     return [array[1], array[0]];
    // }
}

function choice<T>(array: Array<T>): T {
    return array[getRandomInt(0, array.length)];
}

function topicToString(array: number[]): string {
    assert(array.length == 2);
    if (array[0] == array[1]) {
        return objectToString(array[0]);
    } else if (array[0] == Empty) {
        return objectToString(array[1]);
    } else if (array[1] == Empty) {
        return objectToString(array[0]);
    } else {
        return objectToString(array[0]) + " & " + objectToString(array[1]);
    }
}

function objectToString(obj: number): string {
    switch (obj) {
        case Dwarf:
            return "왜소행성";
        case Comet:
            return "혜성";
        case Asteroid:
            return "소행성";
        case GasCloud:
            return "가스구름";
        case Empty:
            return "빈 섹터";
        default:
            return "";
    }
}

interface result {
    name: string;
    result?: boolean;
    type?: string;
    distance?: number | { atLeast: number; all: number };
}

function validResearch(topic: number[], result: result) {
    const validTest = spawn("python", ["app/src/models/validTest.py", JSON.stringify(topic), JSON.stringify(result)]);
    validTest.stdout.on("data", (data: any) => {
        console.log("stdout : ", data.toString());
    });
    validTest.stderr.on("data", (data: any) => {
        console.log(data.toString());
    });
    return true;
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
];

const researchTypes: Function[] = [
    (objList: number[]): result => {
        const obj1 = objList[0];
        const obj2 = objList[1];
        const cnt = indexes(obj1).reduce((cnt: number, idx: number) => {
            if (adjacent(idx).includes(obj2)) {
                cnt += 1;
            }
            return cnt;
        }, 0);
        if (cnt == count(obj1)) {
            return { name: "adjacent", result: true, type: "all" };
        } else if (cnt == 0) {
            return { name: "adjacent", result: false, type: "all" };
        } else {
            return { name: "adjacent", result: true, type: "at-least-one" };
        }
    },
    (objList: number[]): result => {
        const obj1 = objList[0];
        const obj2 = objList[1];
        const cnt = indexes(obj1).reduce((cnt: number, idx: number) => {
            if (opposite(idx) == obj2) {
                cnt += 1;
            }
            return cnt;
        }, 0);
        if (cnt == count(obj1)) {
            return { name: "opposite", result: true, type: "all" };
        } else if (cnt == 0) {
            return { name: "opposite", result: false, type: "all" };
        } else {
            return { name: "opposite", result: true, type: "at-least-one" };
        }
    },
    (objList: number[]): result => {
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
        // { name: "range",}
        return {
            name: "range",
            distance: {
                atLeast: minDistance,
                all: maxDistance,
            },
        };
    },
    (objList: number[]): result => {
        if (objList[0] != objList[1]) {
            return {
                name: "band",
                distance: 12,
            };
        }
        const object = objList[0];
        const sectors = indexes(object);
        if (object == Asteroid) {
            const distances = [
                sectors[1] - sectors[0],
                sectors[2] - sectors[1],
                sectors[3] - sectors[2],
                12 - sectors[3] + sectors[0],
            ];
            return {
                name: "band",
                distance: 12 - Math.max(...distances) + 1,
            };
        } else {
            const distance = sectors[1] - sectors[0];
            if (distance < 6) {
                return {
                    name: "band",
                    distance: distance + 1,
                };
            } else {
                return {
                    name: "band",
                    distance: 12 - distance + 1,
                };
            }
        }
    },
];

_select_research(1);

module.exports = { _select_research };
