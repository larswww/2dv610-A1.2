"use strict";

let mongoose = require("mongoose");

var HSKSchema = new mongoose.Schema({
    levelString: String,
    levelNumber: Number,
    word: String,
    character: String,
    unified: String
});

var HSK = mongoose.model("HSK", HSKSchema);

module.exports = HSK;
