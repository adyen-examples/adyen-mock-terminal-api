class StorageService {
    constructor() {
        if (!StorageService.instance) {
            this.lastRequest = {};
            this.lastResponse = {};
        }
        
        return StorageService.instance;
    }
    
    setLastRequest(request) {
        this.lastRequest = request;
    }

    setLastResponse(response) {
        this.lastResponse = response;
    }

    getLastRequest() {
        return this.lastRequest;
    }

    getLastResponse() {
        return this.lastResponse;
    }
}

const storageService = new StorageService();
module.exports = storageService;