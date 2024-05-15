const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const defaultRoutes = require('./src/routes/defaultRoutes');
const userInteractionRoutes = require('./src/routes/userInteractionRoutes');
const payloadService = require('./src/services/payloadsService')
const { userInteractionService } = require("./src/services/userInteractionService");

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use((err, req, res, next) => {
    // Return a invalidJsonObject response when `express.json()` throws an error.
    if (err instanceof SyntaxError) {
        const invalidJsonObjectResponse = payloadService.getResponseByPrefix("invalidJsonObjectNotification");
        userInteractionService.setLastResponse(invalidJsonObjectResponse);
        res.status(200).send(invalidJsonObjectResponse);
        return;
    }
    
    next(err);
});

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