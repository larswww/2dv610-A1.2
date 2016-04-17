"use strict";

let handlebars = require("express-handlebars").create({defaultLayout: "main"});
let express = require("express");

let app = express();

app.use(express.static(__dirname + "public"));

app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");
app.set("port", process.env.PORT || 3000);

//------    ROUTES  ------//
app.use("/", require("./routes/main.js"));

//------    BOOT    ------//
app.listen(app.get("port"), function () {
    console.log("Express started on http://localhost:" + app.get("port") + "; press Ctrl-C to terminate.");
});


