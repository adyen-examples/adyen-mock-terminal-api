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
        res.status(200).send(payloadService.getResponseByPrefix("abort"));
        return;
    }
    
    if (req.body.SaleToPOIRequest.TransactionStatusRequest) {
        res.status(200).send(payloadService.getResponseByPrefix("paymentTransactionStatus"));
        return;
    }
    
    res.status(404).send("not found");
});

function isApproximateMatch(obj1, obj2) {
    // If either input is not an object, they do not match structurally
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    const keysObj1 = Object.keys(obj1).sort();
    const keysObj2 = Object.keys(obj2).sort();

    for (let i = 0; i < keysObj1.length; i++) {
        const key1 = keysObj1[i];
        const key2 = keysObj2[i];
        
        // If keys at the same position are different, they do not match structurally
        if (key1 !== key2) {
            return false;
        }

        const value1 = obj1[key1];
        const value2 = obj2[key2];

        // Recursively check nested objects for structural match
        if (!isApproximateMatch(value1, value2)) {
            return false; 
        }
    }
    
    // If all keys and nested objects match, they are structurally similar
    return true;
}

module.exports = router;