async function sendRequestButtonOnClick() {
    try {
        disableEnterPinScreen();
        const dropdown = document.getElementById('request-dropdown');
        const requestObject = await sendGetRequest("/requests/" + dropdown.value);
        
        if (requestObject.SaleToPOIRequest.PaymentRequest) {
            enableEnterPinScreen();
        } 
        
        const responseObject = await sendPostRequest("/sync", requestObject);
        updateResponseCodeBlock(responseObject);
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

function updateResponseCodeBlock(response) {
    const responseElement = document.getElementById("json-responses");
    if (responseElement.hasAttribute('data-highlighted')) {
        responseElement.removeAttribute('data-highlighted');
    }
    responseElement.textContent = `${JSON.stringify(response, null, 2)}`;
    hljs.highlightElement(document.getElementById('json-responses'));
}


let lastRequest = pollEndpoint('/get-last-request', updateRequestCodeBlock);
let lastResponse = pollEndpoint('/get-last-response', updateResponseCodeBlock);