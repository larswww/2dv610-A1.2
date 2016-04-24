"use strict";

let mongoose = require("mongoose");

var entrySchema = new mongoose.Schema({
    traditional: String,
    simplified: String,
    unified: String,
    decomposition: [String],
    pinyinNumbers: String,
    pinyinPretty: String,
    pinyinPlain: String,
    tone: Number,
    word: Boolean,
    single: Boolean,
    HSKLevel: Number,
    frequencyData: {
        number: Number,
        count: Number,
        percentage: Number
    },
    definition: [String],
    related: {
        simplified: {
            beginning: [String],
            containing: [String],
            ending: [String]
        },
        traditional: {
            beginning: [String],
            containing: [String],
            ending: [String]
        }
    }
});

var Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
