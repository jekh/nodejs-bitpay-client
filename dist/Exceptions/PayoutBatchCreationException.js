"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutBatchCreationException = void 0;
class PayoutBatchCreationException {
    /**
     * Construct the PayoutBatchCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    constructor(message, apiCode = "000000") {
        this.message = "Failed to create payout batch";
        this.name = "BITPAY-PAYOUT-BATCH-SUBMIT";
        this.code = 202;
        this.apiCode = "000000";
        this.message = Boolean(message) ? message : this.message;
        this.apiCode = Boolean(apiCode) ? apiCode : this.apiCode;
    }
}
exports.PayoutBatchCreationException = PayoutBatchCreationException;
exports.default = PayoutBatchCreationException;
//# sourceMappingURL=PayoutBatchCreationException.js.map