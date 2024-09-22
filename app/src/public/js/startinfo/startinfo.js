"use strict";

const query = new URLSearchParams(location.search);
// const code = parseInt(query.get("code"));
const difficulty = query.get("difficulty");
// const hint = require("../../../models/hint.js");

let hint_num = -1;

// hint(code, hint_num);

if (hint_num > 0) {
    // except very-hard
    for (let i = 0; i < hint_num; i++) {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        th.innerHTML = "";
        const img = document.createElement("img");
        img.setAttribute("src", "");
        img.innerHTML = "";
    }
}
