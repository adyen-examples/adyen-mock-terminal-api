const payloadService = require('../services/payloadsService');
const storageService = require('../services/storageService');
const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    const data = payloadService.getPayloads();
    res.render("index", {
        keys : Object.keys(data)
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
    //await new Promise(resolve => setTimeout(resolve, 5000));
    if (req.body.SaleToPOIRequest.PaymentRequest) {
        response = payloadService.getResponseByPrefix("payment");
        storageService.setLastResponse(response);
        res.status(200).send(response);
        return;
    }
    
    if (req.body.SaleToPOIRequest.ReversalRequest) {
        response = payloadService.getResponseByPrefix("reversal");
        storageService.setLastResponse(response);
        res.status(200).send(response);
        return;
    }

    if (req.body.SaleToPOIRequest.AbortRequest) {
        response = payloadService.getResponseByPrefix("abortPayment");
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
});

router.get("/last-request", async (req, res) => {
    res.status(200).json(storageService.getLastRequest());
});

router.get("/last-response", async (req, res) => {
    res.status(200).json(storageService.getLastResponse());
});

module.exports = router;