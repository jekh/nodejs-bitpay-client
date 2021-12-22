"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutBatchCancellationException = void 0;
class PayoutBatchCancellationException {
    /**
     * Construct the PayoutBatchCancellationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    constructor(message, apiCode = "000000") {
        this.message = "Failed to cancel payout batch";
        this.name = "BITPAY-PAYOUT-BATCH-CANCEL";
        this.code = 204;
        this.apiCode = "000000";
        this.message = Boolean(message) ? message : this.message;
        this.apiCode = Boolean(apiCode) ? apiCode : this.apiCode;
    }
}
exports.PayoutBatchCancellationException = PayoutBatchCancellationException;
exports.default = PayoutBatchCancellationException;
//# sourceMappingURL=PayoutBatchCancellationException.js.map