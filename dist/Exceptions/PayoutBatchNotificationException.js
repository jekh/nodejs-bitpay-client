"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutBatchNotificationException = void 0;
class PayoutBatchNotificationException {
    /**
     * Construct the PayoutBatchNotificationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    constructor(message, apiCode = "000000") {
        this.message = "Failed to payout batch notification";
        this.name = "BITPAY-PAYOUT-BATCH-NOTIFICATION";
        this.code = 205;
        this.apiCode = "000000";
        this.message = Boolean(message) ? message : this.message;
        this.apiCode = Boolean(apiCode) ? apiCode : this.apiCode;
    }
}
exports.PayoutBatchNotificationException = PayoutBatchNotificationException;
exports.default = PayoutBatchNotificationException;
//# sourceMappingURL=PayoutBatchNotificationException.js.map