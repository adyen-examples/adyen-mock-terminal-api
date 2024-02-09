/**
    Handles polling & highlighting of the request/response code blocks.
**/

async function sendRequestButtonOnClick() {
    try {
        // Clear the codeblocks.
        await clearCodeblockButtonOnClick();

        // Select correct request from dropdown.
        const dropdown = document.getElementById('request-dropdown');

        // Find the mock request to send.
        const requestToSend = await sendGetRequest("/requests/" + dropdown.value);

        // Send the request to the sync endpoint.
        const response = await sendPostRequest("/sync", requestToSend);
        updateResponseCodeblock(response);
    } catch(error) {
        console.error(error);
    }
}

async function clearCodeblockButtonOnClick() {
    try {
        const result = await sendPostRequest("/user-interaction/clear-codeblocks-button");
        updateRequestCodeblock(result);
        updateResponseCodeblock(result);
    } catch(error) {
        console.error(error);
    }
}

function updateRequestCodeblock(request) {
    const jsonRequest = `${JSON.stringify(request, null, 2)}`;
    const requestElement = document.getElementById("json-requests");
    if (requestElement.textContent === jsonRequest) {
        return; // Only update the JsonRequest element when there are changes.
    }

    if (requestElement.hasAttribute('data-highlighted')) {
        requestElement.removeAttribute('data-highlighted');
    }
    requestElement.textContent = jsonRequest;
    hljs.highlightElement(document.getElementById('json-requests'));
}

function updateResponseCodeblock(response) {
    const jsonResponse = `${JSON.stringify(response, null, 2)}`;
    const responseElement = document.getElementById("json-responses");
    if (responseElement.textContent === jsonResponse) {
        return;  // Only update the JsonResponse element when there are changes.
    }
    
    if (responseElement.hasAttribute('data-highlighted')) {
        responseElement.removeAttribute('data-highlighted');
    }
    
    responseElement.textContent = jsonResponse;
    hljs.highlightElement(document.getElementById('json-responses'));
}

async function onClickCopyJsonRequest() {
    const requestElement = document.getElementById("json-requests");
    try {
        await navigator.clipboard.writeText(requestElement.textContent);
        console.log("JSON-request successfully copied to clipboard.");
    } catch (error) {
        console.error("Unable to copy text to clipboard: ", error);
    }
}

async function onClickCopyJsonResponse() {
    const responseElement = document.getElementById("json-responses");
    try {
        await navigator.clipboard.writeText(responseElement.textContent);
        console.log("JSON-response successfully copied to clipboard.");
    } catch (error) {
        console.error("Unable to copy text to clipboard: ", error);
    }
}

pollEndpoint('/user-interaction/get-last-request', updateRequestCodeblock);
pollEndpoint('/user-interaction/get-last-response', updateResponseCodeblock);