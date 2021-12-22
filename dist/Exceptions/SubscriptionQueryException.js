"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionQueryException = void 0;
class SubscriptionQueryException {
    /**
     * Construct the SubscriptionQueryException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    constructor(message, apiCode = "000000") {
        this.message = "Failed to retrieve subscription";
        this.name = "BITPAY-SUBSCRIPTION-GET";
        this.code = 173;
        this.apiCode = "000000";
        this.message = Boolean(message) ? message : this.message;
        this.apiCode = Boolean(apiCode) ? apiCode : this.apiCode;
    }
}
exports.SubscriptionQueryException = SubscriptionQueryException;
exports.default = SubscriptionQueryException;
//# sourceMappingURL=SubscriptionQueryException.js.map