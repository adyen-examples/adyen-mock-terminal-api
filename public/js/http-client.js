async function sendGetRequest(url) {
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
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

let intervalId = null;
async function pollLastRequest() {
    let pollingInterval;
    
    async function poll() {
        try {
            const lastRequest = await sendGetRequest('/last-request');
            console.info(lastRequest);
            
        } catch (error) {
            console.error(error);
        }
    }

    pollingInterval = setInterval(poll, 2000);
        
    await poll();
    
    return function stopPolling() {
        clearInterval(pollingInterval);
        console.log("polling stopped");
    }
}

pollLastRequest();