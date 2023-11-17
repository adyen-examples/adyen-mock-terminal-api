const express = require('express');
const path = require("path");;
const handlebars = require("express-handlebars");
const webroutes = require('./src/routes/webroutes');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 8080;

//const shortUniqueId = require('short-unique-id');

// TODO: 
const SALE_ID = process.env.ADYEN_POS_SALE_ID || "SALE_ID_POS_42";
const POI_ID = process.env.ADYEN_POS_POI_ID || "devicenumber-serialnumber";

app.engine("hbs", handlebars({
        extname: "hbs",
        defaultLayout: "layout",
        layoutsDir: path.join(__dirname, "src", "views", "layouts"),
    })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));

app.use("/", webroutes);

app.listen(port, () => console.log(`Server started -> http://localhost:${port}`));