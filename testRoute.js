"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class TestRoute {
    constructor() {
        this.expressInstance = express();
        this.router = express.Router();
        this.router.route('/test').get((req, res) => {
            res.json({ msg: "hello world" });
        });
    }
}
