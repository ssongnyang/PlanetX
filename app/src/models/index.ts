const _observe = require("./observe");
const _select_hint = require("./hint");
const _select_research = require("./research");

function observe(code: number, object: number, start: number, end: number) {
    return _observe(code, object, start, end);
}

function startinfo(code: number, difficulty: string) {
    const result = Object.assign({}, _select_hint(code, difficulty), _select_research(code));
    return result;
}

export { observe, startinfo };
