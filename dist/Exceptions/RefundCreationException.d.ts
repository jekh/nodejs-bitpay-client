import RefundException from "./RefundException";
export declare class RefundCreationException implements RefundException {
    readonly message: string;
    readonly name: string;
    readonly code: number;
    readonly stack: string;
    readonly apiCode: string;
    /**
     * Construct the RefundCreationException.
     *
     * @param message string [optional] The Exception message to throw.
     * @param apiCode string [optional] The API Exception code to throw.
     */
    constructor(message: string, apiCode?: string);
}
export default RefundCreationException;
