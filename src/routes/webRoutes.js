const payloadService = require('../services/payloadsService');
const storageService = require('../services/storageService');
const terminalService = require('../services/terminalService');
const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    const data = payloadService.getPayloads();
    res.render("index", {
        keys : Object.keys(data).filter(key => data[key][0] !== null) // Filter out empty requests, e.g. paymentBusy response
    });
});

router.get("/requests/:prefix", async (req, res) => {
    const { prefix } = req.params;
    storageService.setLastRequest(payloadService.getRequestByPrefix(prefix));
    res.status(200).send(payloadService.getRequestByPrefix(prefix));
});

router.post("/sync", async (req, res) => {
    console.info("incoming /sync request");
    let response = null;
    
    try {
        // Handle abort response.
        if (req.body.SaleToPOIRequest.AbortRequest) {
            response = payloadService.getResponseByPrefix("abortPayment");
            storageService.setLastResponse(response);
            storageService.setState(storageService.STATES.READY);
            res.status(200).send(response);
            return;
        }
        
        // Handle busy response.
        let state = storageService.getState();
        if (state === storageService.STATES.BUSY) {
            response = payloadService.getResponseByPrefix("paymentBusy");
            storageService.setLastResponse(response);
            res.status(200).send(response);
            return;
        }
        
        // Set terminal to busy and start handling logic.
        storageService.setState(storageService.STATES.BUSY);
        
        if (req.body.SaleToPOIRequest.PaymentRequest) {
            // Wait for the confirm button if a payment request is sent.
            const waitResult = await new Promise(resolve => {
                let totalSeconds = 15;
                const countdown = () => {
                    if (terminalService.getIsConfirmed() === true) {  
                        // Pin code entered, accept any pin for now.
                        console.info("Confirm-button pressed");
                        terminalService.setIsConfirmed(false);
                        terminalService.clearPin();
                        resolve(true);
                    } else if (storageService.getState() === storageService.STATES.READY) { 
                        // State changed, f.e. `cancel-button` is pressed.
                        console.info("Cancelled by user");
                        storageService.clearLastRequest();
                        storageService.clearLastResponse();
                        terminalService.clearPin();
                        resolve(false);
                    } else if (totalSeconds > 0) { 
                        // Waiting `totalSeconds` for user to enter pin...
                        console.info("Polling... " + totalSeconds);
                        totalSeconds--;
                        setTimeout(countdown, 1000);
                    } else { 
                        // Time out.
                        console.info("Request has timed-out.");
                        storageService.clearLastRequest();
                        storageService.clearLastResponse();
                        terminalService.clearPin();
                        resolve(false);
                    }
                };

                countdown(); // Start the countdown initially
            });

            if (waitResult === true) {
                response = payloadService.getResponseByPrefix("payment");
                storageService.setLastResponse(response);
            }

            storageService.setState(storageService.STATES.READY);
            res.status(200).send(response);
            return;
        }

        if (req.body.SaleToPOIRequest.ReversalRequest) {
            response = payloadService.getResponseByPrefix("reversal");
            storageService.setLastResponse(response);
            res.status(200).send(response);
            return;
        }

        if (req.body.SaleToPOIRequest.TransactionStatusRequest) {
            response = payloadService.getResponseByPrefix("paymentTransactionStatus");
            storageService.setLastResponse(response);
            res.status(200).send(response);
            return;
        }

        res.status(404).send("not found");
    } catch(e) {
        console.error(e);
        terminalService.clearPin();
        storageService.setState(storageService.STATES.READY);
    }
});

/* Request & Response code-blocks screen start */

router.get("/get-last-request", async (req, res) => {
    res.status(200).json(storageService.getLastRequest());
});

router.get("/get-last-response", async (req, res) => {
    res.status(200).json(storageService.getLastResponse());
});

router.get("/get-pin", async (req, res) => {
    if (storageService.getState() === storageService.STATES.READY) {
        res.status(200).send({});
        return;
    }
    
    res.status(200).send({ pin: terminalService.getPin() });
});

/* Request & Response code-blocks screen end */

/* Terminal-screen pin buttons start */

router.post("/enter-pin", async (req, res) => {
    let currentPin = terminalService.getPin();
    
    // Enforce a maximum length of 4 for pins.
    if (currentPin.length < 4) {
        terminalService.setPin(currentPin + "*");
    }
    res.status(200).send({ pin: terminalService.getPin() });
});

router.post("/confirm-button", async (req, res) => {
    if (terminalService.getPin().length === 4) {
        terminalService.setIsConfirmed(true);
        console.info("Set pin confirmed to true.");
    }
    res.status(200).send({});
});

router.post("/clear-button", async (req, res) => {
    if (storageService.getState() !== storageService.STATES.BUSY) {
        res.status(200).send({});
        return;
    }
    
    terminalService.clearPin();
    console.info("Cleared pin.");
    res.status(200).send({});
});

router.post("/cancel-button", async (req, res) => {
    if (storageService.getState() !== storageService.STATES.BUSY) {
        res.status(200).send({});
        return;
    }
    
    storageService.clearLastRequest();
    storageService.clearLastResponse();
    storageService.setState(storageService.STATES.READY);
    console.info("Cancelled entering pin.");
    res.status(200).send({});
});

/* Terminal-screen pin buttons end */

module.exports = router;