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
    res.status(200).send(payloadService.getRequestByPrefix(prefix));
});

router.post("/sync", async (req, res) => {
    console.info("Incoming /sync request ...");
    storageService.setLastRequest(req.body);
    storageService.clearLastResponse();
    let response = null;
    
    try {
        // Handle abort response.
        if (req.body.SaleToPOIRequest.AbortRequest) {
            response = payloadService.getResponseByPrefix("abortPayment");
            storageService.setLastResponse(response);
            reset();
            res.status(200).send(response);
            return;
        }
        
        // Handle paymentBusy response.
        let state = storageService.getState();
        if (state === storageService.STATES.BUSY) {
            response = payloadService.getResponseByPrefix("paymentBusy");
            storageService.setLastResponse(response);
            res.status(200).send(response);
            return;
        }
        
        if (req.body.SaleToPOIRequest.PaymentRequest) {
            // Set terminal to busy and start handling logic.
            storageService.setState(storageService.STATES.BUSY);

            // Wait for the confirm button if a payment request is sent.
            const isPinEntered = await getPinResult();

            if (isPinEntered) {
                response = payloadService.getResponseByPrefix("payment");
                storageService.setLastResponse(response);
            }

            reset();
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

        res.status(404).send("Request not found.");
    } catch(e) {
        reset();
        console.error(e);
    }
});


function reset() {
    terminalService.clearPin();
    terminalService.setIsConfirmed(false);
    storageService.setState(storageService.STATES.READY);
}


const getPinResult = async () => {
    return new Promise(async resolve => {
        let totalSeconds = 180;
        const waitForPinResult = () => {
            if (terminalService.getIsConfirmed() === true) {  
                // Pin code entered, accept any pin for now.
                console.info("Confirm-button pressed.");
                resolve(true);
            } else if (storageService.getState() === storageService.STATES.READY) { 
                // State changed, f.e. red `cancel-button` is pressed.
                console.info("Cancelled by user.");
                storageService.clearLastRequest();
                storageService.clearLastResponse();
                resolve(false);
            } else if (totalSeconds > 0) { 
                // Waiting `totalSeconds` for user to enter pin...
                console.info("Waiting for pin input... " + totalSeconds);
                totalSeconds--;
                setTimeout(waitForPinResult, 1000);
            } else { 
                // Time out.
                console.info("Request has timed-out.");
                storageService.clearLastRequest();
                storageService.clearLastResponse();
                resolve(false);
            }
        };

        waitForPinResult();
    });
};




/* Request & Response code-blocks screen start */

router.get("/get-last-request", async (req, res) => {
    res.status(200).json(storageService.getLastRequest());
});

router.get("/get-last-response", async (req, res) => {
    res.status(200).json(storageService.getLastResponse());
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

router.post("/clear-codeblocks-button", async (req, res) => {
    storageService.clearLastRequest();
    storageService.clearLastResponse();

    console.info("Cleared the request and response codeblocks.");
    res.status(200).send({});
});
''
router.get("/get-state", async (req, res) => {
    res.status(200).send({ state: storageService.getState() });
});

/* Terminal-screen pin buttons end */



module.exports = router;