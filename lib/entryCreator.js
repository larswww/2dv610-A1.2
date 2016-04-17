/**
 * Created by MBAi on 17/04/2016.
 */

"use strict";

var hanzi = require("hanzi");
var hsk = require("hsk-words");

hanzi.start();

var decomposition = hanzi.decompose('有');
//console.log(decomposition);
//console.log(hanzi.definitionLookup('有'));

////console.log(hanzi.dictionarySearch('心的小孩真', 'only'));
//console.log(hanzi.dictionarySearch('有', 'have'));
////console.log(hanzi.getExamples('有'));
//console.log(hanzi.getCharacterFrequency('有'));
//
//var hsk = require("hsk-words");

//hsk.findLevel("sdaf", function (level) {
//    console.log(level)
//});
//
//hsk.findLevel("你", function (level) {
//    console.log(level)
//});
//
//hsk.findLevel("安静", function (level) {
//    console.log(level)
//});

//hsk.findLevel('有', function(level){
//    // level evaluates to -1 if not found, else is in 1..6
//    console.log(level);
//});

var pinyinTest = hanzi.getCharacterFrequency("有");

var pinyin = require("prettify-pinyin");

console.log(pinyin.prettify(pinyinTest.pinyin));

var EntryCreator = function (character) {

    var definitionLookup = hanzi.definitionLookup(character);

    let simplified = definitionLookup[0].simplified;
    let traditional = definitionLookup[0].traditional;
    let pinyinNumbers = definitionLookup[0].pinyin;
    let definition = definitionLookup[0].definition.split("/");
    let pinyinPretty = pinyin.prettify(definitionLookup[0].pinyin);
    let tones = getTone(pinyinNumbers);
    let word;
    let single;

    if (character.length === 1) {
        word = true;
        single = false;
    } else {
        word = false;
        single = true;
    }

    var HSKLevel = hsk.findLevel(character, function (level) {
        console.log("HSK: " + level);

        return level;
    });

    console.log(simplified, traditional, pinyinNumbers, pinyinPretty, definition, tones, word, single, HSKLevel);

    console.log(hanzi.getCharacterFrequency(character));

    if (single === false) {
        //TODO : frequency data for words needed here..
    } else {

        let freqD = hanzi.getCharacterFrequency(character);
        let frequencyData = {};
        frequencyData.number = freqD.number;
        frequencyData.count = freqD.count;
        frequencyData.percentage = freqD.percentage;
    }

    getRelated(hanzi.dictionarySearch(character), character);

};

var getTone = function (pinyinNumber) {

    let toneNumbers = [];

    //TODO: fix de fulkod
    for (let i = 0; i < pinyinNumber.length; i++) {
        if (pinyinNumber.charAt(i) === "1" || pinyinNumber.charAt(i) === "2" || pinyinNumber.charAt(i) === "3" || pinyinNumber.charAt(i) === "4") {
            toneNumbers.push(pinyinNumber.charAt(i))
        }
    }

    return toneNumbers
};

var getRelated = function (dictSearchResult, character) {

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

    console.log(related);
    return related;
};

EntryCreator("好");

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
