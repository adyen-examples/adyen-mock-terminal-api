const { userInteractionService, STATES } = require("../userInteractionService");

const paymentFailureMap = {
    "124": "124_paymentNotEnoughBalance",
    "125": "125_paymentCardBlocked",
    "126": "126_paymentCardExpired",
    "127": "127_paymentInvalidAmount",
    "128": "128_paymentInvalidCard",
    "134": "134_paymentWrongPin"
};

/**
 * Helper class that determines which `paymentResponse` to return.
 */
class PaymentService {
    constructor() {
        if (!PaymentService.instance) {
        }

        return PaymentService.instance;
    }

    containsPrefix(request) {
        return request.body.SaleToPOIRequest.PaymentRequest;
    }

    async getResponse(request) {
        // Set terminal to busy and start handling logic.
        userInteractionService.setState(STATES.BUSY);

        // Wait for the confirm button if a payment request is sent.
        const isPinEntered = await this.getPinResultAsync();
        userInteractionService.setState(STATES.READY);

        if (isPinEntered) {
            const amount = request.body.SaleToPOIRequest.PaymentRequest.PaymentTransaction.AmountsReq.RequestedAmount;
            const lastThreeDigits = amount.toString()
                .replace('.', '')
                .padStart(3, '0')
                .slice(-3);

            // Look up error code from payment failure.
            const paymentFailure = paymentFailureMap[lastThreeDigits];

            if (paymentFailure) {
                return paymentFailure;
            }

            return "payment";
        }

        return {};
    }


    /**
     * Blocking call that waits until user has entered the pin. Returns a boolean if successful.
     * @returns True, when pin is entered - False, when request is cancelled/time-out.
     */
    getPinResultAsync = async () => {
        return new Promise(async resolve => {
            let totalSeconds = 180;
            const waitForPinResult = () => {
                if (userInteractionService.getIsConfirmed() === true) {
                    // Pin code entered, accept any pin for now.
                    console.info("Confirm-button is pressed.");
                    resolve(true);
                } else if (userInteractionService.getState() === STATES.READY) {
                    // State changed, f.e. red `cancel-button` is pressed.
                    console.info("Cancelled entering-pin by user.");
                    resolve(false);
                } else if (totalSeconds > 0) {
                    // Waiting `totalSeconds` for user to enter pin...
                    console.info("Waiting for pin input... " + totalSeconds);
                    totalSeconds--;
                    setTimeout(waitForPinResult, 1000);
                } else {
                    // Time out.
                    console.info("Request has timed-out.");
                    resolve(false);
                }
            };

            waitForPinResult();
        });
    };
}

const paymentService = new PaymentService();
module.exports = paymentService;