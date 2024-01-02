class TerminalService {
    constructor() {
        if (!TerminalService.instance) {
            this.pin = "";
            this.isConfirmed = false;
        }
        
        return TerminalService.instance;
    }

    getPin() {
        return this.pin;
    }
    
    setPin(pin) {
        this.pin = pin;
    }
    
    clearPin() {
        this.pin = "";
    }
    
    getIsConfirmed() {
        return this.isConfirmed;
    }

    setIsConfirmed(isConfirmed) {
        this.isConfirmed = isConfirmed;
    }
}

const terminalService = new TerminalService();
module.exports = terminalService;