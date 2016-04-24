"use strict";

var LineByLineReader = require("line-by-line");
var HSK = require("../models/HSK");

var populateHSK = function(level) {

    var lr = new LineByLineReader("./dev_resources/HSK/hsk" + level + ".txt");

    lr.on("error", function(err) {
        // 'err' contains error object
    });

    lr.on("line", function(line) {

        let HSKEntry = new HSK ({
            levelString: "1",
            levelNumber: level,
            unified: line
        });

        if (line.length === 1) {
            HSKEntry.character = line
        } else {
            HSKEntry.word = line
        }

        HSKEntry.save()

            .then(function () {
                console.log("Entry saved for: " + line);
                console.log("Searching for BD entry...");

                HSK.findOne({"unified": line}, function(error, match) {
                    console.log(match);
                })

            })

            .catch(function (error) {
                console.error(error);
            });
        // 'line' contains the current line without the trailing newline character.
    });

    lr.on("end", function () {
        // All lines are read, file is closed now.
        console.log("Finished reading file...");
    });

};

module.exports = populateHSK;
