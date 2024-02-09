/**
    Collection of helper functions that allow you to send GET/POST requests or poll endpoints.
**/

async function sendGetRequest(url) {
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return res.json();
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
    
    return res.json();
}

async function pollEndpoint(endpoint, callback, milliseconds = 400) {
    let pollingInterval;

    async function poll() {
        try {
            const response = await sendGetRequest(endpoint);            
            callback(response);
        } catch (error) {
            console.error(error);
        }
    }

    pollingInterval = setInterval(poll, milliseconds);

    await poll();

    return function stopPolling() {
        clearInterval(pollingInterval);
        console.log(`Stopped polling ${endpoint}.`);
    };
}