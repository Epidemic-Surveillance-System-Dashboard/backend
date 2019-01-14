"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const testRoute_1 = require("./src/controllers/testRoute");
const app = express();
const port = process.env.PORT || 3000;
//mount routes here
app.use('/', testRoute_1.TestRoutes);
app.listen(port, () => {
    console.log(`listening at localhost:${port}`);
});
