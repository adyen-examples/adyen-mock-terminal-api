const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const defaultRoutes = require('./src/routes/defaultRoutes');
const userInteractionRoutes = require('./src/routes/userInteractionRoutes');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.engine("hbs", handlebars({
        extname: "hbs",
        defaultLayout: "layout",
        layoutsDir: path.join(__dirname, "src", "views", "layouts"),
        helpers: {
            toUpperCase: function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
            isEqual: function (stringA, stringB) {
                return stringA === stringB;
            }
        }
    })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));

app.use("/", defaultRoutes);
app.use("/user-interaction", userInteractionRoutes);

app.listen(port, () => console.log(`Server started -> http://localhost:${port}`));