"use strict";

export {};

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/startinfo", ctrl.output.startinfo);
router.get("/game", ctrl.output.game);

router.post("/", ctrl.process.startinfo);
router.post("/game", ctrl.process.observe);

module.exports = router;
