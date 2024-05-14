const fs = require('fs');
const path = require('path');

/**
 * Traverses the `/public/payloads`-folder and parse the respective `*Request` and `*Response`-pairs as JSON Objects.
 */
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
     * @returns {Map<String, String[]>}
     */
    getPayloads() {
        return this.data;
    }

    /**
     * Gets the request pair by prefix (key).
     * @param {String} prefix - The key which stores the JsonObjectRequest and JsonObjectResponse.
     * @returns {String} - JsonObject.
     */
    getRequestByPrefix(prefix) {
        return this.data[prefix][0];
    }

    /**
     * Gets the response by prefix (key).
     * @param {String} prefix - The key which stores the JsonObjectRequest and JsonObjectResponse.
     * @returns {String} - JsonObject.
     */
    getResponseByPrefix(prefix) {
        return this.data[prefix][1];
    }

    /**
     * Gets the request and response pair by prefix (key).
     * @param {String} prefix - The key which stores the JsonObjectRequest and JsonObjectResponse.
     * @returns {String[]} - [JsonObject, JsonObject]
     */
    getValueByPrefix(prefix) {
        return this.data[prefix];
    }
}

/**
 * Use reflection (e.g. '/public/payloads'-folder) to load and parse the '-Request.json' and '-Response.json' objects from each directory.
 * @param {String} rootPath - The path of the directory to extract the JSONs from.
 * @returns {Map<String, String[]>}
 */
function getRequestsAndResponses(rootPath) {
    let map = {};
    const root = fs.readdirSync(rootPath);
    const encoding = 'utf-8';

    root.forEach(file => {
        const filePath = path.join(rootPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const files = fs.readdirSync(filePath);
            const responseFiles = files.filter(file => file.endsWith('Response.json'));

            // Retrieve the `*Request.json` and `*Response.json` files and return them as an array of objects.
            const pairs = responseFiles.map(responseFile => {
                // Prefix, e.g. filename "paymentResponse.json" returns "payment".
                const prefix = path.basename(responseFile, 'Response.json');

                // Find the respective `*Request,json` pair for `*Response.json` if any.
                const requestFile = files.find(file => file === prefix + 'Request.json');

                return (
                    {
                        prefix: prefix,
                        requestFileName: requestFile ? requestFile : null,
                        requestJson: requestFile ? JSON.parse(fs.readFileSync(path.join(filePath, requestFile), encoding)) : null,
                        responseFileName: responseFile,
                        responseJson: JSON.parse(fs.readFileSync(path.join(filePath, responseFile), encoding))
                    }
                );
            });

            // Default - Insert into our map: { "payment", [PaymentRequestJson, PaymentResponseJson] }
            // If no `Request.json` is found (f.e. for `paymentBusy`), insert only the response into our map: { "paymentBusy", [null, PaymentBusyResponseJson] }
            pairs.forEach(pair => {
                map[pair.prefix] = [pair.requestJson, pair.responseJson]
            });
        }
    });

    console.info("Found " + Object.keys(map).length + " mock payloads.")

    return map;
}

const payloadService = new PayloadsService();
module.exports = payloadService;