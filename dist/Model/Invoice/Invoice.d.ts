import { Buyer } from "./Buyer";
import { InvoiceBuyerProvidedInfo } from "./InvoiceBuyerProvidedInfo";
import { InvoiceTransaction } from "./InvoiceTransaction";
import { MinerFees } from "./MinerFees";
import { Shopper } from "./Shopper";
import { RefundInfo } from "./RefundInfo";
import { SupportedTransactionCurrencies } from "./SupportedTransactionCurrencies";
export interface InvoiceInterface {
    currency: string | null;
    guid: string | null;
    token: string | null;
    price: number | null;
    posData: any | null;
    notificationURL: string | null;
    transactionSpeed: string | null;
    fullNotifications: boolean | null;
    notificationEmail: string | null;
    redirectURL: string | null;
    closeURL: string | null;
    orderId: string | null;
    itemDesc: string | null;
    itemCode: string | null;
    physical: boolean | null;
    paymentCurrencies: string[] | [];
    acceptanceWindow: number | null;
    autoRedirect: boolean | null;
    buyer: Buyer | null;
    id: string | null;
    url: string | null;
    status: string | null;
    lowFeeDetected: boolean | null;
    invoiceTime: number | null;
    expirationTime: number | null;
    currentTime: number | null;
    exceptionStatus: string | false | null;
    targetConfirmations: number | null;
    transactions: InvoiceTransaction[] | null;
    refundAddresses: any | null;
    refundAddressRequestPending: boolean | null;
    buyerProvidedEmail: string | null;
    invoiceBuyerProvidedInfo: InvoiceBuyerProvidedInfo;
    supportedTransactionCurrencies: SupportedTransactionCurrencies | null;
    minerFees: Partial<MinerFees> | null;
    shopper: Shopper | null;
    billId: string | null;
    refundInfo: RefundInfo | null;
    extendedNotifications: boolean | null;
    transactionCurrency: string | null;
    amountPaid: number | null;
    displayAmountPaid: number | null;
    exchangeRates: {
        [currency: string]: {
            [currency: string]: number;
        };
    } | null;
    paymentSubtotals: {
        [currency: string]: number;
    } | null;
    paymentTotals: {
        [currency: string]: number;
    } | null;
    paymentDisplayTotals: {
        [currency: string]: string;
    } | null;
    paymentDisplaySubTotals: {
        [currency: string]: string;
    } | null;
    nonPayProPaymentReceived: boolean | null;
    jsonPayProRequired: boolean | null;
    underpaidAmount: number | null;
    overpaidAmount: number | null;
    paymentCodes: {
        [currency: string]: {
            [paymentCode: string]: string;
        };
    } | null;
}
export declare class Invoice implements InvoiceInterface {
    currency: string | null;
    guid: string | null;
    token: string | null;
    price: number | null;
    posData: string | null;
    notificationURL: string | null;
    transactionSpeed: string | null;
    fullNotifications: boolean | null;
    notificationEmail: string | null;
    redirectURL: string | null;
    closeURL: string | null;
    orderId: string | null;
    itemDesc: string | null;
    itemCode: string | null;
    physical: boolean | null;
    paymentCurrencies: string[] | [];
    acceptanceWindow: number | null;
    autoRedirect: boolean | null;
    buyer: Buyer | null;
    id: string | null;
    url: string | null;
    status: string | null;
    lowFeeDetected: boolean | null;
    invoiceTime: number | null;
    expirationTime: number | null;
    currentTime: number | null;
    exceptionStatus: string | false | null;
    targetConfirmations: number | null;
    transactions: InvoiceTransaction[] | null;
    refundAddresses: any | null;
    refundAddressRequestPending: boolean | null;
    buyerProvidedEmail: string | null;
    invoiceBuyerProvidedInfo: InvoiceBuyerProvidedInfo;
    supportedTransactionCurrencies: SupportedTransactionCurrencies | null;
    minerFees: Partial<MinerFees> | null;
    shopper: Shopper | null;
    billId: string | null;
    refundInfo: RefundInfo | null;
    extendedNotifications: boolean | null;
    transactionCurrency: string | null;
    amountPaid: number | null;
    displayAmountPaid: number | null;
    exchangeRates: {
        [currency: string]: {
            [currency: string]: number;
        };
    } | null;
    paymentSubtotals: {
        [currency: string]: number;
    } | null;
    paymentTotals: {
        [currency: string]: number;
    } | null;
    paymentDisplayTotals: {
        [currency: string]: string;
    } | null;
    paymentDisplaySubTotals: {
        [currency: string]: string;
    } | null;
    nonPayProPaymentReceived: boolean | null;
    jsonPayProRequired: boolean | null;
    underpaidAmount: number | null;
    overpaidAmount: number | null;
    paymentCodes: {
        [currency: string]: {
            [paymentCode: string]: string;
        };
    } | null;
    /**
     * Constructor, create a minimal request Invoice object.
     *
     * @param price    The amount for which the invoice will be created.
     * @param currency The three digit currency type used to compute the invoice bitcoin amount.
     */
    constructor(price: number, currency: string);
    setCurrency(_currency: string): void;
}
