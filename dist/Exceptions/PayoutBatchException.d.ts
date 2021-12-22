import BitPayException from "./BitPayException";
export declare class PayoutBatchException implements BitPayException {
    readonly message: string;
    readonly name: string;
    readonly code: number;
    readonly stack: string;
    readonly apiCode: string;
    /**
     * Construct the PayoutBatchException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    constructor(message: string, apiCode?: string);
}
export default PayoutBatchException;
