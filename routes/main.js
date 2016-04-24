"use strict";

let router = require("express").Router();
let Entry = require("../models/entry");

router.route("/")
    .get(function(req, res) {
        res.render("home")
    });

router.route("/definition/:character/:definition")
    .get(function(req, res) {
        console.log("Searching db for: " + req.params.character);

        let query = Entry.findOne({"simplified": req.params.character});


        query.then(function(doc){
            console.log(doc);
            res.render("definition", {entry: doc})
        }).catch(function(error){
            console.error(error);
        })
    });

module.exports = router;
