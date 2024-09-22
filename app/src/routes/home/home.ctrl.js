"use strict";

const { resolveInclude } = require("ejs");
const url = require("url");
const { select_hint } = require("../../models/hint");

const output = {
    home: (req, res) => {
        res.render("home/index");
    },

    startinfo: (req, res) => {
        // const difficulty = url.parse(req.url, true).query.difficulty;
        // const code = window.localStorage.getItem("code");
        // localStorage.setItem("first-hint", JSON.stringify(hint(code, difficulty)));
        res.render("startinfo/startinfo");
    },

    game: (req, res) => {
        res.render("home/game");
    },
};

const process = {
    home: (req, res) => {
        const code = Math.floor(Math.random() * 4446);
        const { difficulty } = req.body;
        const response = select_hint(code, difficulty);
        return res.send(response);
    },
};

module.exports = {
    output,
    process,
};
