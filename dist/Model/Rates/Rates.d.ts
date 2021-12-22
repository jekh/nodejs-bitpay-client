import { Client } from "../../Client";
interface RateInterface {
    Name: string;
    cryptoCode: string;
    currencyPair: string;
    code: string;
    rate: number;
}
declare class Rates {
    private _rates;
    private _client;
    constructor(rates: RateInterface[], client: Client);
    private castRatesObj;
    GetRates(): RateInterface[];
    Update(): Promise<void>;
    GetRate(currencyCode: string): Number;
}
export { Rates, RateInterface };
