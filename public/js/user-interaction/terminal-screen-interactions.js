/**
 Handles user-interactions that happens on the terminal, e.g. pin, buttons, screen text etc.
 **/


function getScreenPinElement() {
    return document.getElementById("screen-pin");
}

function enableEnterPinScreen() {
    getScreenPinElement().classList.remove("hidden");
    clearPin();
    updateScreenText("Enter your pin...");
}

function disableEnterPinScreen() {
    getScreenPinElement().classList.add("hidden");
    clearPin();
    updateScreenText("Send Terminal API requests to this application's `/sync` endpoint...");
}

function updatePin(pin) {
    getScreenPinElement().textContent = pin;
}

function clearPin() {
    getScreenPinElement().textContent = "";
}

function updateScreenText(text) {
    document.getElementById("screen").textContent = text;
}

let currentState = "READY";

function updateState(response) {
    if (response.state === "BUSY") { // Pin.
        if (getScreenPinElement().classList.contains("hidden")) {
            enableEnterPinScreen();
        }
    } else if (response.state === "READY") { // No pin.
        if (!getScreenPinElement().classList.contains("hidden")) {
            disableEnterPinScreen();
        }
    }
    currentState = response.state;
}


function isAllowedToEnterPin() {
    return currentState === "BUSY";
}

function bindAllTerminalButtons() {
    // Binds 0...9 buttons.
    for (let i = 0; i < 10; i++) {
        const button = document.getElementById(i + "-button");
        button.dataset.number = i.toString();
        button.addEventListener('click', async () => {
            try {
                if (!isAllowedToEnterPin()) {
                    return;
                }

                let response = await sendPostRequest("/user-interaction/enter-pin");
                if (response && Object.keys(response).length > 0) {
                    updatePin(response.pin);
                }
            } catch (e) {
                console.error(e);
            }
        });
    }

    // Binds green `confirm` button.
    const confirmButton = document.getElementById("confirm-button");
    confirmButton.addEventListener('click', async () => {
        if (!isAllowedToEnterPin()) {
            return;
        }

        if (getScreenPinElement().textContent.length < 4) {
            updateScreenText("Invalid pin, must be 4-digits, enter pin again:");
            return;
        }

        await sendPostRequest("/user-interaction/confirm-button");
    });

    // Binds orange `clear` button.
    const clearButton = document.getElementById("clear-button");
    clearButton.addEventListener('click', async () => {
        if (!isAllowedToEnterPin()) {
            return;
        }

        await sendPostRequest("/user-interaction/clear-button");
        clearPin();
    });

    // Binds red `cancel` button.
    const cancelButton = document.getElementById("cancel-button");
    cancelButton.addEventListener('click', async () => {
        if (!isAllowedToEnterPin()) {
            return;
        }

        await sendPostRequest("/user-interaction/cancel-button");
    });
}

bindAllTerminalButtons();

pollEndpoint('/user-interaction/get-state', updateState);