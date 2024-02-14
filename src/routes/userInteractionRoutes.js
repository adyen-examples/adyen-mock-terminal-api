const { userInteractionService, STATES } = require('../services/userInteractionService');
const express = require('express');
const router = express.Router();


/* Request & response code-blocks screen polling start */

router.get("/get-state", async (req, res) => {
    res.status(200).send({ state: userInteractionService.getState() });
});

router.get("/get-last-request", async (_req, res) => {
    res.status(200).json(userInteractionService.getLastRequest());
});

router.get("/get-last-response", async (req, res) => {
    res.status(200).json(userInteractionService.getLastResponse());
});

router.post("/clear-codeblocks-button", async (req, res) => {
    userInteractionService.clearLastRequestAndResponse();
    console.info("Cleared the request and response codeblocks.");
    res.status(200).send({});
});

/* Request & response code-blocks screen polling end */



/* Terminal-screen buttons start */

router.post("/enter-pin", async (req, res) => {
    let currentPin = userInteractionService.getPin();
    
    // Enforce a maximum length of 4 for pins.
    if (currentPin.length < 4) {
        userInteractionService.setPin(currentPin + "*");
    }

    res.status(200).send({ pin: userInteractionService.getPin() });
});

router.post("/confirm-button", async (req, res) => {
    if (userInteractionService.getPin().length === 4) {
        userInteractionService.setIsConfirmed(true);
        console.info("Set pin confirmed to true.");
    }
    res.status(200).send({});
});

router.post("/clear-button", async (req, res) => {
    if (userInteractionService.getState() !== STATES.BUSY) {
        res.status(200).send({});
        return;
    }
    
    userInteractionService.clearPin();
    res.status(200).send({});
});

router.post("/cancel-button", async (req, res) => {
    if (userInteractionService.getState() !== STATES.BUSY) {
        res.status(200).send({});
        return;
    }
    
    userInteractionService.clearLastRequestAndResponse();
    userInteractionService.setState(STATES.READY);

    console.info("Cancelled entering pin.");
    res.status(200).send({});
});


/* Terminal-screen buttons end */

module.exports = router;