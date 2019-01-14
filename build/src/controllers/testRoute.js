"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/', (req, res) => {
    res.json({ msg: "hello world" });
});
router.get('/testing', (req, res) => {
    res.json({ msg: "hello world test" });
});
exports.TestRoutes = router;
