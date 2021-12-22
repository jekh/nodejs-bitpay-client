"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutBatchQueryException = void 0;
class PayoutBatchQueryException {
    /**
     * Construct the PayoutBatchQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    constructor(message, apiCode = "000000") {
        this.message = "Failed to retrieve payout batch";
        this.name = "BITPAY-PAYOUT-BATCH-GET";
        this.code = 203;
        this.apiCode = "000000";
        this.message = Boolean(message) ? message : this.message;
        this.apiCode = Boolean(apiCode) ? apiCode : this.apiCode;
    }
}
exports.PayoutBatchQueryException = PayoutBatchQueryException;
exports.default = PayoutBatchQueryException;
//# sourceMappingURL=PayoutBatchQueryException.js.map