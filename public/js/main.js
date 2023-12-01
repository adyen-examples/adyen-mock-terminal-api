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
        const dropdown = document.getElementById('request-dropdown');
        
        const requestObject = await sendGetRequest("/requests/" + dropdown.value);
        updateRequestElement(requestObject);
        console.info(requestObject);
        
        updateScreenElement(dropdown.value);
        // Wait for Terminal input here.
        
        const responseObject = await sendPostRequest("/sync", requestObject);
        updateResponseElement(responseObject);
        console.info(responseObject);
        
    } catch(error) {
        console.error(error);
    }
}

function updateRequestElement(request) {
    const requestElement = document.getElementById("json-requests");
    
    if (requestElement.hasAttribute('data-highlighted')) {
        requestElement.removeAttribute('data-highlighted');
    }
    requestElement.textContent = `${JSON.stringify(request, null, 2)}`;
    hljs.highlightElement(document.getElementById('json-requests'));
}

function updateScreenElement(text) {
    const screenElement = document.getElementById("screen");
    screenElement.textContent = text;
}

function updateResponseElement(response) {
    const element = document.getElementById("json-responses");
    
    if (element.hasAttribute('data-highlighted')) {
        element.removeAttribute('data-highlighted');
    }
    
    element.textContent = `${JSON.stringify(response, null, 2)}`;
    hljs.highlightElement(document.getElementById('json-responses'));
}