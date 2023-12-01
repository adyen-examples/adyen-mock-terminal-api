const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const webRoutes = require('./src/routes/webRoutes');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 3000;

//const shortUniqueId = require('short-unique-id');

app.engine("hbs", handlebars({
        extname: "hbs",
        defaultLayout: "layout",
        layoutsDir: path.join(__dirname, "src", "views", "layouts"),
        helpers: {
            capitalizeFirstLetter: function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        }
    })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));

app.use("/", webRoutes);

app.listen(port, () => console.log(`Server started -> http://localhost:${port}`));