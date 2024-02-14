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
 * Use reflection (e.g. '/public/payloads'-folder) to load and parse the '-Request.json' and '-Response.json' objects from each directory.
 * @param {string} rootPath - The path of the directory to extract the JSONs from.
 * @returns {Map<string, string[]>} 
 */
function getRequestsAndResponses(rootPath) {
    const map = {};
    const root = fs.readdirSync(rootPath);

    root.forEach(file => {
       const filePath = path.join(rootPath, file); 
       const stat = fs.statSync(filePath);
       
       if (stat.isDirectory()) {
           const files = fs.readdirSync(filePath);

           // Find `Request.json` and `Response.json` files.
           const requestFile = files.find(f => f.endsWith('Request.json'));
           const responseFile = files.find(f => f.endsWith('Response.json'));
           
           // Parse (optional) `Request.json`.
           let requestJson = null;
           if (requestFile) {
               const requestFilePath = path.join(filePath, requestFile);
               requestJson = JSON.parse(fs.readFileSync(requestFilePath, 'utf8'));
           }
           
           // Parse (mandatory) `Response.json`.
           const responseFilePath = path.join(filePath, responseFile);
           const responseJson = JSON.parse(fs.readFileSync(responseFilePath, 'utf8'));

           // Default - Insert into our map: { "payment", [PaymentRequestJson, PaymentResponseJson] }
           // If no `Request.json` is found (f.e. for `paymentBusy`), insert only the response into our map: { "paymentBusy", [null, PaymentBusyResponseJson] }
           map[file] = [requestJson, responseJson];
       }
    });
    
    console.info("Found " + Object.keys(map).length + " mock payloads.")

    return map;
}

const payloadService = new PayloadsService();
module.exports = payloadService;