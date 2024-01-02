class StorageService {
    constructor() {
        if (!StorageService.instance) {
            this.STATES = {
                READY: "ready",
                BUSY: "busy"
            };
            
            this.lastRequest = {};
            this.lastResponse = {};
            this.state = this.STATES.READY;
        }
        
        return StorageService.instance;
    }

    getState() {
        return this.state;
    }
    
    setState(state) {
        this.state = state;
    }
    
    getLastResponse() {
        return this.lastResponse;
    }

    setLastResponse(response) {
        this.lastResponse = response;
    }
    
    clearLastResponse() {
        this.lastResponse = {};
    }

    getLastRequest() {
        return this.lastRequest;
    }

    setLastRequest(request) {
        this.lastRequest = request;
    }
    
    clearLastRequest() {
        this.lastRequest = {};
    }
}

const storageService = new StorageService();
module.exports = storageService;