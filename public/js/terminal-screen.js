let allowUserToEnterPin = false; 

function getScreenPinElement() {
    return document.getElementById("screen-pin");
}

function enableEnterPinScreen() {
    getScreenPinElement().classList.remove("hidden");
    clearPin();
    updateScreenText("Enter your pin...");
    allowUserToEnterPin = true;
}

function disableEnterPinScreen() {
    getScreenPinElement().classList.add("hidden");
    clearPin();
    updateScreenText("");
    allowUserToEnterPin = false;
}


function updatePin(pin) {
    if (!allowUserToEnterPin) {
        return;
    }
    
    getScreenPinElement().textContent = pin;
}

function clearPin() {
    getScreenPinElement().textContent = "";
}

function updateScreenText(text) {
    document.getElementById("screen").textContent = text;
}

function bindAllTerminalButtons() {
    // Binds 0..9- buttons.
    for (let i = 0; i < 10; i++) {
        const button = document.getElementById(i + "-button");
        button.dataset.number = i.toString();
        button.addEventListener('click', async () => {
            try {
                let response = await sendPostRequest("/enter-pin");
                if (response && Object.keys(response).length > 0) {
                    updatePin(response.pin);
                }
            } catch(e) {
                console.error(e);
            }
        });
    }

    // Binds green confirm button.
    const confirmButton = document.getElementById("confirm-button");
    confirmButton.addEventListener('click', async () => {
        try {
            if (!lastRequest) {
                console.warn("Select a request to send first.")
                return;
            }
            
            if (!allowUserToEnterPin) {
                return;
            }
            
            const screenPinElement = getScreenPinElement();
            if (screenPinElement.textContent.length < 4) {
                updateScreenText("Invalid pin, must be 4-digits, enter pin again:");
                return;
            }
        
            await sendPostRequest("/confirm-button");
            disableEnterPinScreen();
            updateScreenText("See response for the result.");
        } catch(e) {
            console.error(e);
        }
    });

    // Binds orange clear button.
    const clearButton = document.getElementById("clear-button");
    clearButton.addEventListener('click', async () => {
        await sendPostRequest("/clear-button");
        clearPin();
    });

    // Binds red cancel button.
    const cancelButton = document.getElementById("cancel-button");
    cancelButton.addEventListener('click', async () => {
        await sendPostRequest("/cancel-button");
        disableEnterPinScreen();
        clearPin();
        updateScreenText("Send a Terminal API request to localhost:3000/sync...");
    });
}

bindAllTerminalButtons();