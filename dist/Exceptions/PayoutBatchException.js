"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutBatchException = void 0;
class PayoutBatchException {
    /**
     * Construct the PayoutBatchException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    constructor(message, apiCode = "000000") {
        this.message = "An unexpected error occurred while trying to manage the payout batch";
        this.name = "BITPAY-PAYOUT-BATCH-GENERIC";
        this.code = 201;
        this.apiCode = "000000";
        this.message = Boolean(message) ? message : this.message;
        this.apiCode = Boolean(apiCode) ? apiCode : this.apiCode;
    }
}
exports.PayoutBatchException = PayoutBatchException;
exports.default = PayoutBatchException;
//# sourceMappingURL=PayoutBatchException.js.map