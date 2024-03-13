const payloadService = require('../services/payloadsService');
const { userInteractionService, STATES } = require('../services/userInteractionService');
const express = require('express');
const router = express.Router();

const http = require('http');

router.get("/test", async (req, res) => {
    const postData = JSON.stringify({
        "SaleToPOIRequest": {
            "MessageHeader": {
                "ProtocolVersion": "3.0",
                "MessageClass": "Service",
                "MessageCategory": "Payment",
                "MessageType": "Request",
                "ServiceID": "1234567890AB",
                "SaleID": "SALE_ID_42",
                "POIID": "V400m-123456789"
            },
            "PaymentRequest": {
                "SaleData": {
                    "SaleToAcquirerData": "tenderOption=ReceiptHandler",
                    "SaleTransactionID": {
                        "TransactionID": "21f1268f-9126-4bce-b127-9c2d5ffa024e",
                        "TimeStamp": "2023-06-12T12:08:36+00:00"
                    }
                },
                "PaymentTransaction": {
                    "AmountsReq": {
                        "Currency": "EUR",
                        "RequestedAmount": 10.99
                    }
                }
            }
        }
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/sync',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
            'X-API-Key': 'your-api-key...',
            'User-Agent': 'Mock Terminal-API Application'
        }
    };

    const httpRequest = http.request(options, (response) => {
        let responseData = '';

        response.on('data', (chunk) => {
            responseData += chunk;
        });

        response.on('end', () => {
            console.log('Response:', responseData);
            res.send(responseData);
        });
    });

    httpRequest.on('error', (error) => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    });

    httpRequest.write(postData);
    httpRequest.end();
});

// Root index page.
router.get("/", async (req, res) => {
    const data = payloadService.getPayloads();
    res.render("index", {
        keys : Object.keys(data).filter(key => data[key][0] !== null) // Filter out empty requests, e.g. paymentBusy response
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
    } catch(e) {
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