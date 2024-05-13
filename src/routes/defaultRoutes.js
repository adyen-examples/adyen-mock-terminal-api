const payloadService = require('../services/payloadsService');
const { userInteractionService, STATES } = require('../services/userInteractionService');
const express = require('express');
const router = express.Router();

const paymentFailureMap = {
    "124": "124_paymentNotEnoughBalance",
    "125": "125_paymentCardBlocked",
    "126": "126_paymentCardExpired",
    "127": "127_paymentInvalidAmount",
    "128": "128_paymentInvalidCard",
    "134": "134_paymentInvalidPin"
};

// Root index page.
router.get("/", async (req, res) => {
    const data = payloadService.getPayloads();
    res.render("index", {
        keys: Object.keys(data).filter(key => data[key][0] !== null) // Filter out empty requests, e.g. paymentBusy response
    });
});

// Used for request selection in the drop-down menu.
router.get("/requests/:prefix", async (req, res) => {
    const { prefix } = req.params;
    res.status(200).send(payloadService.getRequestByPrefix(prefix));
});

// The terminal accepts requests in this `/sync` endpoint.
router.post("/sync", async (req, res) => {
    console.info("Incoming /sync request ...");
    userInteractionService.setLastRequest(req.body);
    userInteractionService.setLastResponse({});

    try {
        // Handle abort request.
        if (req.body.SaleToPOIRequest.AbortRequest) {
            userInteractionService.setState(STATES.READY);
            sendOKResponse(res, "abortPayment");
            return;
        }

        // Handle paymentBusy response.
        if (userInteractionService.getState() === STATES.BUSY) {
            sendOKResponse(res, "paymentBusy");
            return;
        }

        // Handle payment request.
        if (req.body.SaleToPOIRequest.PaymentRequest) {
            // Set terminal to busy and start handling logic.
            userInteractionService.setState(STATES.BUSY);

            // Wait for the confirm button if a payment request is sent.
            const isPinEntered = await getPinResultAsync();
            userInteractionService.setState(STATES.READY);

            if (isPinEntered) {
                const amount = req.body.SaleToPOIRequest.PaymentRequest.PaymentTransaction.AmountsReq.RequestedAmount;
                const lastThreeDigits = amount.toString()
                    .replace('.', '')
                    .padStart(3, '0')
                    .slice(-3);
                
                // Look up error code from payment failure.
                const paymentFailure = paymentFailureMap[lastThreeDigits];

                if (paymentFailure) {
                    sendOKResponse(res, paymentFailure);
                    return;
                }
                
                sendOKResponse(res, "payment");
                return;
            }

            res.status(200).send({});
            return;
        }

        // Handle reversal request.
        if (req.body.SaleToPOIRequest.ReversalRequest) {
            sendOKResponse(res, "reversal");
            return;
        }

        // Handle paymentTransactionStatus request.
        if (req.body.SaleToPOIRequest.TransactionStatusRequest) {
            sendOKResponse(res, "paymentTransactionStatus");
            return;
        }

        // Handle requests not found.
        userInteractionService.setState(STATES.READY);
        console.error("Request not found: " + req.body);
        res.status(404).send({});
    } catch (e) {
        userInteractionService.setState(STATES.READY);
        console.error(e);
    }
});

/**
 * Helper function that returns a 200 response for given `prefix` key.
 */
function sendOKResponse(res, prefix) {
    const response = payloadService.getResponseByPrefix(prefix);
    userInteractionService.setLastResponse(response);
    res.status(200).send(response);
}


/**
 * Blocking call that waits until user has entered the pin. Returns a boolean if successful.
 * @returns True, when pin is entered - False, when request is cancelled/time-out.
 */
const getPinResultAsync = async () => {
    return new Promise(async resolve => {
        let totalSeconds = 180;
        const waitForPinResult = () => {
            if (userInteractionService.getIsConfirmed() === true) {
                // Pin code entered, accept any pin for now.
                console.info("Confirm-button is pressed.");
                resolve(true);
            } else if (userInteractionService.getState() === STATES.READY) {
                // State changed, f.e. red `cancel-button` is pressed.
                console.info("Cancelled entering-pin by user.");
                resolve(false);
            } else if (totalSeconds > 0) {
                // Waiting `totalSeconds` for user to enter pin...
                console.info("Waiting for pin input... " + totalSeconds);
                totalSeconds--;
                setTimeout(waitForPinResult, 1000);
            } else {
                // Time out.
                console.info("Request has timed-out.");
                resolve(false);
            }
        };

        waitForPinResult();
    });
};

module.exports = router;