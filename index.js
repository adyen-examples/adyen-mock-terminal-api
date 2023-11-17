const express = require('express')
const path = require("path");
const handlebars = require("express-handlebars");

const app = express()
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 8080;

app.engine("hbs", handlebars({
        extname: "hbs",
        defaultLayout: "layout",
        layoutsDir: path.join(__dirname, "src", "views", "layouts"),
    })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));

app.get("/", (req, res) => res.render("index"));

app.listen(port, () => console.log(`Server started -> http://localhost:${port}`));