async function sendGetRequest(url) {
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    return await res.json();
}

async function sendPostRequest(url, data) {
    const res = await fetch(url, {
        method: "POST",
        body: data ? JSON.stringify(data) : "",
        headers: {
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "Keep-Alive": "timeout=180, max=180"
        },
    });

    return await res.json();
}

async function sendRequestButtonOnClick() {
    try {
        clearRequestCodeBlock();
        clearResponseCodeBlock();
        clearPin();
        const dropdown = document.getElementById('request-dropdown');
       
        const requestObject = await sendGetRequest("/requests/" + dropdown.value);
        console.info(requestObject);
        updateRequestCodeBlock(requestObject);
        
        selectedJsonRequest = requestObject;
        
        if (requestObject.SaleToPOIRequest.PaymentRequest) {
            updateScreen("Enter your pin ...")
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

function updateScreen(text) {
    const screenElement = document.getElementById("screen");
    screenElement.textContent = text;
}

function updatePin(pinNumber) {
    const screenPinElement = document.getElementById("screen-pin");
    if (screenPinElement.textContent.length < 4) {
        screenPinElement.textContent += "*";
    }
}

function clearPin(){
    const screenPinElement = document.getElementById("screen-pin");
    screenPinElement.textContent = "";
}

let selectedJsonRequest = null;
function bindAllTerminalButtons() {
    // Binds 0..9- buttons.
    for (var i = 0; i < 10; i++) {
        const button = document.getElementById(i + "-button");
        button.addEventListener('click', function() {
            updatePin(this.dataset.number);
        });
        button.dataset.number = i.toString();
    }
    
    // Binds green confirm button.
    const confirmButton = document.getElementById("confirm-button");
    confirmButton.addEventListener('click', async () => {
        try {
            if (!selectedJsonRequest) {
                console.warn("Select a request to send first.")
                return;
            }
            const responseObject = await sendPostRequest("/sync", selectedJsonRequest);
            updateResponseCodeBlock(responseObject);
            console.info(responseObject);
        } catch(e) {
            console.error(e);
        }
    });
    
    // Binds orange clear button.
    const clearButton = document.getElementById("clear-button");
    clearButton.addEventListener('click', function() {
        clearPin();
    });
    
    // Binds red cancel button.
    const cancelButton = document.getElementById("cancel-button");
    cancelButton.addEventListener('click', function() {
        clearRequestCodeBlock();
        clearResponseCodeBlock();
        clearPin();
        updateScreen("Send a request ...");
    });
}

bindAllTerminalButtons();