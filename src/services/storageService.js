class StorageService {
    constructor() {
        if (!StorageService.instance) {
            this.STATES = {
                READY: "READY",
                BUSY: "BUSY"
            };

            this.lastRequest = {};
            this.lastResponse = {};
            this.state = this.STATES.READY;
        }
        
        return StorageService.instance;
    }

    /**
     * Get the state of the terminal.
     * @returns {STATES} - String.
     */
     getState() {
        return this.state;
    }

    /**
     * Set the state of the terminal.
     * @param {STATES state} - State of the terminal.
     */
    setState(state) {
        this.state = state;
        console.info("State changed to: " + state);
    }

    /**
     * Get the last response returned by the terminal.
     * @returns {JsonObject} - JsonObject.
     */
    getLastResponse() {
        return this.lastResponse;
    }

    /**
     * Set the last response returned by the terminal.
     * @param {JsonObject lastResponse} JsonObject
     */
    setLastResponse(response) {
        this.lastResponse = response;
        console.info("Last response is set to: " + JSON.stringify(this.lastResponse, null, 2));
    }
    
    /**
     * Remove last response returned by the terminal.
     */
    clearLastResponse() {
        this.lastResponse = {};
    }

    /**
     * Get the last request returned by the terminal.
     * @returns {JsonObject} - JsonObject.
     */
    getLastRequest() {
        return this.lastRequest;
    }

    /**
     * Sets the last response returned by the terminal.
     * @param {JsonObject request} - JsonObject
     */
    setLastRequest(request) {
        this.lastRequest = request;
        console.info("Last request is set to: " + JSON.stringify(this.lastRequest, null, 2));
    }

    /**
     * Remove last request returned by the terminal.
     */
    clearLastRequest() {
        this.lastRequest = {};
    }
}

const storageService = new StorageService();
module.exports = storageService;