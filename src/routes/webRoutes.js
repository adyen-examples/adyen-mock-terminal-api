const payloadService = require('../services/payloadsService');
const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    const data = payloadService.getData();
    res.render("index", {
        keys : Object.keys(data)
    });
});

router.get("/requests/:prefix", async (req, res) => {
    const { prefix } = req.params;
    res.status(200).send(payloadService.getRequestByPrefix(prefix));
});

router.post("/sync", async (req, res) => {
    console.info(req.body);
    
    if (req.body.SaleToPOIRequest.PaymentRequest) {
        res.status(200).send(payloadService.getResponseByPrefix("payment"));
        return;
    }
    
    if (req.body.SaleToPOIRequest.ReversalRequest) {
        res.status(200).send(payloadService.getResponseByPrefix("reversal"));
        return;
    }

    if (req.body.SaleToPOIRequest.AbortRequest) {
        res.status(200).send(payloadService.getResponseByPrefix("abortPayment"));
        return;
    }
    
    if (req.body.SaleToPOIRequest.TransactionStatusRequest) {
        res.status(200).send(payloadService.getResponseByPrefix("paymentTransactionStatus"));
        return;
    }
    
    res.status(404).send("not found");
});

module.exports = router;