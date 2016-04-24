/**
 * Created by MBAi on 17/04/2016.
 */

"use strict";

var hanzi = require("hanzi");
var HSKdb = require("../models/HSK");
var Entry = require("../models/entry");

hanzi.start();

var pinyin = require("prettify-pinyin");

var EntryCreator = function(character) {

    console.log("length:   " + character.length);

    var definitionLookup = hanzi.definitionLookup(character);

    let characterEntry = new Entry({
        simplified: definitionLookup[0].simplified,
        traditional: definitionLookup[0].traditional,
        pinyinNumbers: definitionLookup[0].pinyin,
        definition: definitionLookup[0].definition.split("/"),
        pinyinPretty: pinyin.prettify(definitionLookup[0].pinyin),
        tones: getTone(definitionLookup[0].pinyin)
    });

    let simplified = definitionLookup[0].simplified;
    let traditional = definitionLookup[0].traditional;
    let pinyinNumbers = definitionLookup[0].pinyin;
    let definition = definitionLookup[0].definition.split("/");
    let pinyinPretty = pinyin.prettify(definitionLookup[0].pinyin);
    let tones = getTone(pinyinNumbers);
    let word;
    let single;

    if (character.length === 2) {
        word = true;
        single = false;
        characterEntry.word = true;
        characterEntry.single = false;
    } else {
        word = false;
        single = true;
        characterEntry.word = false;
        characterEntry.single = true;
    }

    // TODO: needs to go in a promise

    if (single) {
        let freqD = hanzi.getCharacterFrequency(character);
        let frequencyData = {};
        frequencyData.number = freqD.number;
        frequencyData.count = freqD.count;
        frequencyData.percentage = freqD.percentage;
        characterEntry.frequencyData = frequencyData;
        characterEntry.related = getRelated(hanzi.dictionarySearch(character), character);

    } else {
        // what to do with words?
    }

    //{ "_id" : ObjectId("571cd20d510d9ea807b8514e"), "word" : "爸爸", "levelString" : "1", "levelNumber" : 1, "unified" : "爸爸", "__v" : 0 }


    var HSKLevel = HSKdb.findOne({"unified": character}, "unified levelNumber levelString character word", function(err, match) {
        if (err) {console.error(err)}

    });

    HSKLevel.then(function(doc) {

        characterEntry.HSKLevel = doc.levelNumber;
        characterEntry.levelString = doc.levelString;

        console.log(doc);
        console.log(simplified, traditional, pinyinNumbers, pinyinPretty, definition, tones, word, single, doc.levelString);
        console.log("DB Entry saved: " + characterEntry);

        characterEntry.save()
    })

    .catch(function(error) {
        console.error(error);
    })

};

var getTone = function(pinyinNumber) {

    let toneNumbers = [];

    //TODO: fix de fulkod
    for (let i = 0; i < pinyinNumber.length; i++) {
        if (pinyinNumber.charAt(i) === "1" || pinyinNumber.charAt(i) === "2" || pinyinNumber.charAt(i) === "3" || pinyinNumber.charAt(i) === "4") {
            toneNumbers.push(pinyinNumber.charAt(i))
        }
    }

    return toneNumbers
};

var getRelated = function(dictSearchResult, character) {

    var related = {
        simplified: {
            beginning: [],
            containing: [],
            ending: []
        },
        traditional: {
            beginning: [],
            containing: [],
            ending: []
        }
    };

    dictSearchResult.forEach(assignedRelated);

    function assignedRelated(element, index, array) {

        let word = element[0];
        let length = element[0].simplified.length - 1;

        if (element[0].simplified.charAt(0) === character) {
            related.simplified.beginning.push(element[0].simplified);
            related.traditional.beginning.push(word.traditional)

        } else if (element[0].simplified.charAt(length) === character) {
            related.simplified.ending.push(element[0].simplified);
            related.traditional.ending.push(word.traditional);

        } else {
            related.simplified.containing.push(word.simplified);
            related.traditional.containing.push(word.traditional);
        }
    }

    return related;
};

module.exports = EntryCreator;

/**
 * var entrySchema = new mongoose.Schema({
    traditional: String,
    simplified: String,
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
        beginning: [String],
        containing: [String],
        ending: [String]
    }
});
 */
