let allowUserToEnterPin = false; // Allows user to enter pin on the terminal screen
let selectedJsonRequest = null; // Used for debugging, which allows you to send a request from the application itself.

function getScreenPinElement() {
    return document.getElementById("screen-pin");
}

function enableEnterPinScreen() {
    getScreenPinElement().classList.remove("hidden");
    clearPin();
    updateScreen("Enter your pin...");
    allowUserToEnterPin = true;
}

function disableEnterPinScreen() {
    getScreenPinElement().classList.add("hidden");
    clearPin();
    updateScreen();
    allowUserToEnterPin = false;
}

function updatePin() {
    if (!allowUserToEnterPin) {
        return;
    }
    const screenPinElement = getScreenPinElement();
    if (screenPinElement.textContent.length < 4) {
        screenPinElement.textContent += "*";
    }
}

function clearPin() {
    getScreenPinElement().textContent = "";
}

function updateScreen(text = "") {
    document.getElementById("screen").textContent = text;
}

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
            
            const screenPinElement = getScreenPinElement();
            if (screenPinElement.textContent.length < 4) {
                updateScreen("Invalid pin, enter pin again:");
                clearPin();
                return;
            }
            
            const responseObject = await sendPostRequest("/sync", selectedJsonRequest);
            disableEnterPinScreen();
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
        disableEnterPinScreen();
        updateScreen("Send a Terminal API request to localhost:3000/sync...");
    });
}

bindAllTerminalButtons();