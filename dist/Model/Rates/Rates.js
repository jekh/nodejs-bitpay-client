"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rates = void 0;
const RateQueryException_1 = require("../../Exceptions/RateQueryException");
class Rates {
    constructor(rates, client) {
        this._rates = this.castRatesObj(rates);
        this._client = client;
    }
    castRatesObj(ratesObj) {
        try {
            if (typeof ratesObj === 'string' || ratesObj instanceof String) {
                ratesObj = JSON.parse(ratesObj.toString());
            }
            return ratesObj;
        }
        catch (e) {
            throw new RateQueryException_1.default(e);
        }
    }
    GetRates() {
        return this._rates;
    }
    async Update() {
        try {
            this._rates = await Promise.resolve(this._client.GetRates());
        }
        catch (e) {
            throw new RateQueryException_1.default(e);
        }
    }
    GetRate(currencyCode) {
        let val = 0;
        this._rates.forEach(function (rate) {
            if (rate.code === currencyCode) {
                val = rate.rate;
                return val;
            }
        });
        return val;
    }
}
exports.Rates = Rates;
//# sourceMappingURL=Rates.js.map