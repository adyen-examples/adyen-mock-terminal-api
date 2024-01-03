class TerminalService {
    constructor() {
        if (!TerminalService.instance) {
            this.SCREENSTATES = {
                DEFAULT: "DEFAULT",
                ENTER_PIN: "ENTER_PIN",
            };

            this.pin = "";
            this.isConfirmed = false;
            this.screenState = this.SCREENSTATES.DEFAULT;
        }
        
        return TerminalService.instance;
    }

    /**
     * Gets the screen state of the terminal.
     * @returns {SCREENSTATES} - String.
     */
     getScreenState() {
        return this.screenState;
    }

    /**
     * Sets the screen state of the terminal.
     * @param {SCREENSTATES screenState} - ScreenState of the terminal.
     */
    setScreenState(screenState) {
        this.screenState = screenState;
    }

    /**
     * Gets the pin-code.
     * @returns {string pin} - Pin-code.
     */
    getPin() {
        return this.pin;
    }
    
    /**
     * Sets the pin-code.
     * @param {string pin} - Pin-code.
     */
    setPin(pin) {
        this.pin = pin;
        console.info("Pin set to: " + this.pin);
    }
    
    /**
     * Removes the pin-code.
     */
    clearPin() {
        this.pin = "";
        console.info("Cleared pin.");
    }
    
    /**
     * Returns true when the green confirm-button is pressed on the terminal.
     * @returns {boolean} - True when the confirm-button has been pressed.
     */
    getIsConfirmed() {
        return this.isConfirmed;
    }

    /**
     * Set to true when to green confirm-button is pressed on the terminal.
     * @param {boolean isConfirmed} - True when the confirm-button has been pressed.
     */
    setIsConfirmed(isConfirmed) {
        this.isConfirmed = isConfirmed;
        console.info("Confirm-button pressed: " + this.isConfirmed);
    }
}

const terminalService = new TerminalService();
module.exports = terminalService;