"use strict";
export {};
const { resolveInclude } = require("ejs");
const url = require("url");
const { observe, startinfo } = require("../../models/index");

let code: number;

const output = {
    home: (req: any, res: any) => {
        res.render("home/index");
    },

    startinfo: (req: any, res: any) => {
        // const difficulty = url.parse(req.url, true).query.difficulty;
        // const code = window.localStorage.getItem("code");
        // localStorage.setItem("first-hint", JSON.stringify(hint(code, difficulty)));
        res.render("startinfo/startinfo");
    },

    game: (req: any, res: any) => {
        res.render("home/game");
    },
};

const process = {
    startinfo: (req: any, res: any) => {
        code = Math.floor(Math.random() * 4446);
        // console.log(code);
        const { difficulty } = req.body;
        const response = startinfo(code, difficulty);
        return res.send(response);
    },

    observe: (req: any, res: any) => {
        const { object, start, end } = req.body;
        if (!code) {
            console.log("code not defined");
            code = 1; //임시
        }
        const response = {
            code: code,
            result: observe(code, object, start, end),
        };
        return res.json(response);
    },
};

module.exports = {
    output,
    process,
};
