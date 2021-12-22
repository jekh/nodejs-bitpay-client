"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutBatch = void 0;
class PayoutBatch {
    /**
     * Constructor, create an instruction-full request PayoutBatch object.
     *
     * @param currency      The three digit currency string for the PayoutBatch to use.
     * @param ledgerCurrency string Ledger currency code set for the payout request (ISO 4217 3-character currency code), it indicates on which ledger the payout request will be recorded. If not provided in the request, this parameter will be set by default to the active ledger currency on your account, e.g. your settlement currency.
     * @param instructions  Payout instructions.
     */
    constructor(currency, instructions, ledgerCurrency) {
        this.currency = currency;
        this.instructions = instructions;
        this.ledgerCurrency = ledgerCurrency;
    }
}
exports.PayoutBatch = PayoutBatch;
//# sourceMappingURL=PayoutBatch.js.map