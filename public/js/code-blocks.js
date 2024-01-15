/**
    Handles polling & highlighting of the request/response code blocks.
**/

async function sendRequestButtonOnClick() {
    try {
        // Clear the codeblocks.
        clearCodeblockButtonOnClick();

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
        const response = await sendPostRequest("/clear-codeblocks-button");
        updateRequestCodeblock(response);
        updateResponseCodeblock(response);
    } catch(error) {
        console.error(error);
    }
}

function updateRequestCodeblock(request) {
    const requestElement = document.getElementById("json-requests");
    if (requestElement.hasAttribute('data-highlighted')) {
        requestElement.removeAttribute('data-highlighted');
    }
    requestElement.textContent = `${JSON.stringify(request, null, 2)}`;
    hljs.highlightElement(document.getElementById('json-requests'));
}

function updateResponseCodeblock(response) {
    const responseElement = document.getElementById("json-responses");
    if (responseElement.hasAttribute('data-highlighted')) {
        responseElement.removeAttribute('data-highlighted');
    }
    responseElement.textContent = `${JSON.stringify(response, null, 2)}`;
    hljs.highlightElement(document.getElementById('json-responses'));
}

async function OnClickCopyJsonRequest() {
    const requestElement = document.getElementById("json-requests");
    try {
        await navigator.clipboard.writeText(requestElement.textContent);
        console.log("Text successfully copied to clipboard.");
    } catch (error) {
        console.error("Unable to copy text to clipboard: ", error);
    }
}

async function OnClickCopyJsonResponse() {
    const requestElement = document.getElementById("json-responses");
    try {
        await navigator.clipboard.writeText(requestElement.textContent);
        console.log("Text successfully copied to clipboard.");
    } catch (error) {
        console.error("Unable to copy text to clipboard: ", error);
    }
}

pollEndpoint('/get-last-request', updateRequestCodeblock);
pollEndpoint('/get-last-response', updateResponseCodeblock);