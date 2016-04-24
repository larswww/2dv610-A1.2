"use strict";

let handlebars = require("express-handlebars").create({defaultLayout: "main"});
let express = require("express");
let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cn5k");
let db = mongoose.connection;
let populateHSK = require("./lib/HSKEntryCreator");
let entryCreator = require("./lib/entryCreator");



let app = express();

app.use(express.static(__dirname + "public"));

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", process.env.PORT || 8000);

//-------------         DATABASE         -------------//

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
    console.log("DB open");
});

process.on("SIGINT", function() {
    db.close(function() {
        console.log("Mongoose connection disconnected through app termination.");
        process.exit(0);
    });
});

//------    ROUTES  ------//
app.use("/", require("./routes/main.js"));

//------    BOOT    ------//
app.listen(app.get("port"), function() {
    console.log("Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate.");
});

//populateHSK(1);
entryCreator("有");
entryCreator("你");
entryCreator("好");
entryCreator("爸爸");
entryCreator("爱");
//entryCreator("觉得");
//entryCreator("你呢");
//entryCreator("可以");


