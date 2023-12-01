const fs = require('fs');
const path = require('path');

class PayloadsService {
    constructor() {
        this.data = getData(path.join(__dirname, '../../public/payloads'));
    }

    /**
     * Gets the JsonObjectRequest and JsonObjectResponse.
     * Example entry: { "key", [JsonObjectRequest, JsonObjectResponse] }
     * Example entry: { "payment", [PaymentRequest, PaymentResponse] }
     * @returns {Map<string, string[]>}
     */
    getData() {
        return this.data;
    }

    /**
     * Get the request and response pair by prefix (key).
     * @param {string} prefix - The key which stores the JsonObjectRequest and JsonObjectResponse.
     * @returns {string[]} - JsonObject.
     */
    getRequestByPrefix(prefix) {
        return this.data[prefix][0];
    }

    /**
     * Get the response by prefix (key).
     * @param {string} prefix - The key which stores the JsonObjectRequest and JsonObjectResponse.
     * @returns {string} - JsonObject.
     */
    getResponseByPrefix(prefix) {
        return this.data[prefix][1];
    }
}

/**
 * Use reflection in the '/public/payloads'-folder to get extract the '-Request.json' and '-Response.json'.
 * @param {string} directory - The directory to extract the data from.
 * @returns {Map<string, string[]>} 
 */
function getData(directory) {
    const map = {};
    const files = fs.readdirSync(directory);

    // Filter files that end with '-Request.json' and extract the matching '-Response.json'
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

    return map;
}

const instance = new PayloadsService();
module.exports = instance;