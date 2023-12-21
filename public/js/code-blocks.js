async function sendRequestButtonOnClick() {
    try {
        clearRequestCodeBlock();
        clearResponseCodeBlock();
        const dropdown = document.getElementById('request-dropdown');
       
        const requestObject = await sendGetRequest("/requests/" + dropdown.value);
        console.info(requestObject)
        updateRequestCodeBlock(requestObject);
        
        selectedJsonRequest = requestObject;
        
        if (requestObject.SaleToPOIRequest.PaymentRequest) {
            enableEnterPinScreen();
        } else { 
            if (requestObject.SaleToPOIRequest.AbortRequest) {
                updateScreen("Transaction aborted ...");
            } else if (requestObject.SaleToPOIRequest.TransactionStatusRequest) {
                updateScreen("Transaction Status requested ...");
            } else if (requestObject.SaleToPOIRequest.ReversalRequest) {
                updateScreen("Reversal requested ...");
            }
            const responseObject = await sendPostRequest("/sync", selectedJsonRequest);
            updateResponseCodeBlock(responseObject);
            console.info(responseObject);
        }
    } catch(error) {
        console.error(error);
    }
}

function updateRequestCodeBlock(request) {
    const requestElement = document.getElementById("json-requests");
    if (requestElement.hasAttribute('data-highlighted')) {
        requestElement.removeAttribute('data-highlighted');
    }
    requestElement.textContent = `${JSON.stringify(request, null, 2)}`;
    hljs.highlightElement(document.getElementById('json-requests'));
}

function clearRequestCodeBlock() {
    const requestElement = document.getElementById("json-requests");
    requestElement.textContent = "";
}

function updateResponseCodeBlock(response) {
    const responseElement = document.getElementById("json-responses");
    if (responseElement.hasAttribute('data-highlighted')) {
        responseElement.removeAttribute('data-highlighted');
    }
    responseElement.textContent = `${JSON.stringify(response, null, 2)}`;
    hljs.highlightElement(document.getElementById('json-responses'));
}

function clearResponseCodeBlock() {
    const responseElement = document.getElementById("json-responses");
    responseElement.textContent = "";
}
