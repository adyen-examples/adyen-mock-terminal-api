const fs = require('fs');
const path = require('path');

class PayloadsService {
    constructor() {
        if (!PayloadsService.instance) {
            this.data = getRequestsAndResponses(path.join(__dirname, '../../public/payloads'));
        }
        
        return PayloadsService.instance;
    }

    /**
     * Gets the JsonObjectRequest and JsonObjectResponse.
     * Example entry: { "key", [JsonObjectRequest, JsonObjectResponse] }
     * Example entry: { "payment", [PaymentRequest, PaymentResponse] }
     * @returns {Map<string, string[]>}
     */
    getPayloads() {
        return this.data;
    }
    
    /**
     * Gets the request pair by prefix (key).
     * @param {string} prefix - The key which stores the JsonObjectRequest and JsonObjectResponse.
     * @returns {string} - JsonObject.
     */
    getRequestByPrefix(prefix) {
        return this.data[prefix][0];
    }

    /**
     * Gets the response by prefix (key).
     * @param {string} prefix - The key which stores the JsonObjectRequest and JsonObjectResponse.
     * @returns {string} - JsonObject.
     */
    getResponseByPrefix(prefix) {
        return this.data[prefix][1];
    }

    /**
     * Gets the request and response pair by prefix (key).
     * @param {string} prefix - The key which stores the JsonObjectRequest and JsonObjectResponse.
     * @returns {string[]} - [JsonObject, JsonObject]
     */
    getValueByPrefix(prefix) {
        return this.data[prefix];
    }
}

/**
 * Use reflection in the '/public/payloads'-folder to load and parse the '-Request.json' and '-Response.json' objects.
 * @param {string} directory - The directory to extract the data from.
 * @returns {Map<string, string[]>} 
 */
function getRequestsAndResponses(directory) {
    const map = {};
    const files = fs.readdirSync(directory);

    // Map files that end with '-Request.json' and extract the matching '-Response.json'
    const requestFiles = files.filter(file => file.endsWith('Request.json'));
    requestFiles.forEach(requestFile => {
        const requestFilePath = path.join(directory, requestFile);
        
        const prefix = requestFile.replace('Request.json', '');
        const responseFilePath = path.join(directory, `${prefix}Response.json`);

        if (fs.existsSync(responseFilePath)) {
            const requestJson = JSON.parse(fs.readFileSync(requestFilePath, 'utf8'));
            const responseJson = JSON.parse(fs.readFileSync(responseFilePath, 'utf8'));
            map[prefix] = [requestJson, responseJson]; // { "payment", [PaymentRequest, PaymentResponse] }
        }
    });
    
    // Map "paymentBusy"-response manually, which does not have a predefined request.
    map["paymentBusy"] = [ null, JSON.parse(fs.readFileSync(path.join(directory, `paymentBusyResponse.json`), 'utf8'))];

    console.info("Found " + Object.keys(map).length + " mock payloads.")

    return map;
}

const payloadService = new PayloadsService();
module.exports = payloadService;