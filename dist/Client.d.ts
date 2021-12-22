import { Tokens } from './index';
import { Bill, BillInterface, Invoice, InvoiceInterface, LedgerEntryInterface, LedgerInterface, Payout, PayoutInterface, PayoutBatch, PayoutBatchInterface, PayoutRecipientInterface, PayoutRecipients, RateInterface } from "./Model";
import { Refund, RefundInterface } from "./Model/Invoice/Refund";
import { Settlement, SettlementInterface } from "./Model/Settlement/Settlement";
import { Subscription, SubscriptionInterface } from "./Model/Subscription/Subscription";
/**
 * @author Antonio Buedo
 * @version 2.0.2112
 * See bitpay.com/api for more information.
 * date 22.12.2021
 */
export declare class Client {
    private _configuration;
    private _env;
    private _tokenCache;
    private _ecKey;
    private _RESTcli;
    _currenciesInfo: [];
    private _keyUtils;
    constructor(configFilePath: string);
    constructor(configFilePath: null | undefined, environment: string, privateKey: string, tokens: Tokens);
    private BuildConfigFromFile;
    private BuildConfig;
    private initKeys;
    private init;
    private LoadCurrencies;
    /**
     * Gets info for specific currency.
     *
     * @param currencyCode String Currency code for which the info will be retrieved.
     * @return Map|null
     */
    GetCurrencyInfo(currencyCode: string): Promise<any>;
    private GetGuid;
    private LoadAccessTokens;
    private ClearAccessTokenCache;
    private GetAccessToken;
    GetRates: (currency?: string) => Promise<RateInterface[]>;
    CreateInvoice(invoice: Invoice, facade?: string, signRequest?: boolean): Promise<InvoiceInterface>;
    GetInvoice(invoiceId: string, facade?: string, signRequest?: boolean): Promise<InvoiceInterface>;
    GetInvoices(dateStart: string, dateEnd: string, status?: string, orderId?: string, limit?: number, offset?: number): Promise<InvoiceInterface[]>;
    /**
     * Request a BitPay Invoice Webhook.
     *
     * @param invoiceId String The id of the Invoice.
     * @return True if the webhook was successfully requested, false otherwise.
     * @throws BitPayException BitPayException class
     * @throws InvoiceQueryException InvoiceQueryException class
     */
    GetInvoiceWebHook(invoiceId: string): Promise<Boolean>;
    /**
     * Create a refund for a BitPay invoice.
     *
     * @param invoice     A BitPay invoice object for which a refund request should be made.  Must have been obtained using the merchant facade.
     * @param refundEmail The email of the buyer to which the refund email will be sent
     * @param amount      The amount of money to refund. If zero then a request for 100% of the invoice value is created.
     * @param currency    The three digit currency code specifying the exchange rate to use when calculating the refund bitcoin amount. If this value is "BTC" then no exchange rate calculation is performed.
     * @return True if the refund was successfully canceled, false otherwise.
     * @throws RefundCreationException RefundCreationException class
     */
    CreateRefund(invoice: Invoice, refundEmail: string, amount: number, currency: string): Promise<Boolean>;
    /**
     * Retrieve a previously made refund request on a BitPay invoice.
     *
     * @param invoice  The BitPay invoice having the associated refund.
     * @param refundId The refund id for the refund to be updated with new status.
     * @return A BitPay invoice object with the associated Refund object updated.
     * @throws RefundQueryException RefundQueryException class
     */
    GetRefund(invoice: Invoice, refundId: string): Promise<RefundInterface>;
    /**
     * Retrieve all refund requests on a BitPay invoice.
     *
     * @param invoice The BitPay invoice object having the associated refunds.
     * @return A BitPay invoice object with the associated Refund objects updated.
     * @throws RefundQueryException RefundQueryException class
     */
    GetRefunds(invoice: Invoice): Promise<RefundInterface[]>;
    /**
     * Cancel a previously submitted refund request on a BitPay invoice.
     *
     * @param invoice  The BitPay invoice having the associated refund to be canceled. Must have been obtained using the merchant facade.
     * @param refund The refund to be canceled.
     * @return True if the refund was successfully canceled, false otherwise.
     * @throws RefundCancellationException RefundCancellationException class
     */
    CancelRefund(invoice: Invoice, refund: Refund): Promise<Boolean>;
    /**
     * Create a BitPay Bill.
     *
     * @param bill        A Bill object with request parameters defined.
     * @return A BitPay generated Bill object.
     * @throws BitPayException       BitPayException class
     * @throws BillCreationException BillCreationException class
     */
    CreateBill(bill: Bill): Promise<BillInterface>;
    /**
     * Retrieve a collection of BitPay bills.
     *
     * @param status The status to filter the bills.
     * @return A list of BitPay Bill objects.
     * @throws BitPayException    BitPayException class
     * @throws BillQueryException BillQueryException class
     */
    GetBills(status?: string): Promise<BillInterface[]>;
    /**
     * Retrieve a BitPay bill by bill id using the specified facade.
     *
     * @param billId      The id of the bill to retrieve.
     * @return A BitPay Bill object.
     * @throws BitPayException    BitPayException class
     * @throws BillQueryException BillQueryException class
     */
    GetBill(billId: string): Promise<BillInterface>;
    /**
     * Update a BitPay Bill.
     *
     * @param bill   A Bill object with the parameters to update defined.
     * @param billId The Id of the Bill to udpate.
     * @return An updated Bill object.
     * @throws BitPayException     BitPayException class
     * @throws BillUpdateException BillUpdateException class
     */
    UpdateBill(bill: Bill, billId: string): Promise<BillInterface>;
    /**
     * Deliver a BitPay Bill.
     *
     * @param billId      The id of the requested bill.
     * @param billToken   The token of the requested bill.
     * @return A response status returned from the API.
     * @throws BillDeliveryException BillDeliveryException class
     */
    DeliverBill(billId: string, billToken: string): Promise<Boolean>;
    /**
     * Retrieve a list of ledgers by date range using the merchant facade.
     *
     * @param currency  The three digit currency string for the ledger to retrieve.
     * @param dateStart The first date for the query filter.
     * @param dateEnd   The last date for the query filter.
     * @return A Ledger object populated with the BitPay ledger entries list.
     * @throws LedgerQueryException LedgerQueryException class
     */
    GetLedger(currency: string, dateStart: string, dateEnd: string): Promise<LedgerEntryInterface[]>;
    /**
     * Retrieve a list of ledgers using the merchant facade.
     *
     * @return A list of Ledger objects populated with the currency and current balance of each one.
     * @throws LedgerQueryException LedgerQueryException class
     */
    GetLedgers(): Promise<LedgerInterface>;
    /**
     * Submit BitPay Payout Recipients.
     *
     * @param recipients PayoutRecipients A PayoutRecipients object with request parameters defined.
     * @return array A list of BitPay PayoutRecipients objects..
     * @throws BitPayException BitPayException class
     * @throws PayoutRecipientCreationException PayoutRecipientCreationException class
     */
    SubmitPayoutRecipients(recipients: PayoutRecipients): Promise<PayoutRecipientInterface[]>;
    /**
     * Retrieve a collection of BitPay Payout Recipients.
     *
     * @param status String|null The recipient status you want to query on.
     * @param limit  int|null Maximum results that the query will return (useful for paging results).
     *               result).
     * @param offset number The offset to filter the Payout Recipients.
     * @return array     A list of BitPayRecipient objects.
     * @throws BitPayException BitPayException class
     * @throws PayoutRecipientQueryException PayoutRecipientQueryException class
     */
    GetPayoutRecipients(status: string, limit: number, offset: number): Promise<PayoutRecipientInterface[]>;
    /**
     * Retrieve a BitPay payout recipient.
     *
     * @param recipientId String The id of the recipient to retrieve.
     * @return PayoutRecipient A BitPay PayoutRecipient object.
     * @throws BitPayException BitPayException class
     * @throws PayoutRecipientQueryException PayoutRecipientQueryException class
     */
    GetPayoutRecipient(recipientId: string): Promise<PayoutRecipientInterface>;
    /**
     * Update BitPay Payout Recipient.
     *
     * @param recipientId String The id of the recipient to update.
     * @param label String The new label for the recipient.
     * @param notificationURL String The new notificationURL for the recipient.
     * @return PayoutRecipient A BitPay PayoutRecipient object.
     * @throws BitPayException BitPayException class
     * @throws PayoutRecipientUpdateException PayoutRecipientUpdateException class
     */
    UpdatePayoutRecipient(recipientId: string, label: string, notificationURL: string): Promise<PayoutRecipientInterface>;
    /**
     * Cancel a previously submitted refund request on a BitPay invoice.
     *
     * @param recipientId The Payout Recipient to be deleted.
     * @return True if the recipient was successfully deleted, false otherwise.
     * @throws PayoutRecipientCancellationException PayoutRecipientCancellationException class
     */
    DeletePayoutRecipient(recipientId: string): Promise<Boolean>;
    /**
     * Request a BitPay payout recipient Webhook.
     *
     * @param recipientId String The id of the recipient.
     * @return True if the webhook was successfully requested, false otherwise.
     * @throws BitPayException BitPayException class
     * @throws PayoutRecipientNotificationException PayoutRecipientNotificationException class
     */
    GetPayoutRecipientWebHook(recipientId: string): Promise<Boolean>;
    /**
     * Submit a BitPay Payout.
     *
     * @param payout A Payout object with request parameters defined.
     * @return A BitPay generated Payout object.
     * @throws BitPayException         BitPayException class
     * @throws PayoutCreationException PayoutCreationException class
     */
    SubmitPayout(payout: Payout): Promise<PayoutInterface>;
    /**
     * Retrieve a collection of BitPay payouts.
     *
     * @param startDate string The startDate to filter the Payout.
     * @param endDate string The endDate to filter the Payout.
     * @param status string The status to filter the Payout.
     * @param reference string The reference to filter the Payout.
     * @param limit number Maximum results that the query will return (useful for paging results).
     * @param offset number The offset to filter the Payout.
     * @return A BitPay Payout objects.
     * @throws BitPayException      BitPayException class
     * @throws PayoutQueryException PayoutQueryException class
     */
    GetPayouts(startDate: string, endDate: string, status: string, reference: string, limit: number, offset: number): Promise<PayoutInterface[]>;
    /**
     * Retrieve a BitPay payout by payout id using.  The client must have been previously authorized for the payout facade.
     *
     * @param payoutId The id of the batch to retrieve.
     * @return A BitPay PayoutBatch object.
     * @throws BitPayException      BitPayException class
     * @throws PayoutQueryException PayoutQueryException class
     */
    GetPayout(payoutId: string): Promise<PayoutInterface>;
    /**
     * Cancel a BitPay Payout.
     *
     * @param payoutId string The id of the payout to cancel.
     * @return Payout A BitPay generated Payout object.
     * @throws PayoutDeleteException BitPayException class
     */
    CancelPayout(payoutId: string): Promise<Boolean>;
    /**
     * Notify BitPay Payout.
     *
     * @param  payoutId string The id of the Payout to notify.
     * @return True if the notification was successfully sent, false otherwise.
     * @throws PayoutNotificationException BitPayException class
     */
    RequestPayoutNotification(payoutId: string): Promise<Boolean>;
    /**
     * Submit a BitPay Payout batch.
     *
     * @param batch A PayoutBatch object with request parameters defined.
     * @return A BitPay generated PayoutBatch object.
     * @throws BitPayException         BitPayException class
     * @throws PayoutBatchCreationException PayoutBatchCreationException class
     */
    SubmitPayoutBatch(batch: PayoutBatch): Promise<PayoutBatchInterface>;
    /**
     * Retrieve a BitPay payout batch by batch id using.  The client must have been previously authorized for the payout facade.
     *
     * @param batchId The id of the batch to retrieve.
     * @return A BitPay PayoutBatch object.
     * @throws BitPayException      BitPayException class
     * @throws PayoutBatchQueryException PayoutBatchQueryException class
     */
    GetPayoutBatch(payoutBatchId: string): Promise<PayoutBatchInterface>;
    /**
     * Retrieve a collection of BitPay payout batches.
     *
     * @param startDate string The startDate to filter the Payout Batches.
     * @param endDate string The endDate to filter the Payout Batches.
     * @param status string The status to filter the Payout Batches.
     * @param limit number Maximum results that the query will return (useful for paging results).
     * @param offset number The offset to filter the Payout Batches.
     * @return A list of BitPay PayoutBatch objects.
     * @throws BitPayException      BitPayException class
     * @throws PayoutBatchQueryException PayoutBatchQueryException class
     */
    GetPayoutBatches(startDate: string, endDate: string, status: string, limit: number, offset: number): Promise<PayoutBatchInterface[]>;
    /**
     * Cancel a BitPay Payout batch.
     *
     * @param payoutBatchId The id of the batch to cancel.
     * @return A BitPay generated PayoutBatch object.
     * @throws BitPayException      BitPayException class
     * @throws PayoutBatchCancellationException PayoutBatchCancellationException class
     */
    CancelPayoutBatch(payoutBatchId: string): Promise<Boolean>;
    /**
     * Notify BitPay Payout Batch.
     *
     * @param  payoutBatchId string The id of the Payout to notify.
     * @return True if the notification was successfully sent, false otherwise.
     * @throws BitPayException      BitPayException class
     * @throws PayoutBatchNotificationException PayoutBatchNotificationException class
     */
    RequestPayoutBatchNotification(payoutBatchId: string): Promise<Boolean>;
    /**
     * Retrieves settlement reports for the calling merchant filtered by query.
     * The `limit` and `offset` parameters
     * specify pages for large query sets.
     *
     * @param currency  The three digit currency string for the ledger to retrieve.
     * @param dateStart The start date for the query.
     * @param dateEnd   The end date for the query.
     * @param status    Can be `processing`, `completed`, or `failed`.
     * @param limit     Maximum number of settlements to retrieve.
     * @param offset    Offset for paging.
     * @return A list of BitPay Settlement objects.
     * @throws SettlementQueryException SettlementQueryException class
     */
    GetSettlements(currency: string, dateStart: string, dateEnd: string, status: string, limit: number, offset: number): Promise<SettlementInterface[]>;
    /**
     * Retrieves a summary of the specified settlement.
     *
     * @param settlementId Settlement Id.
     * @return A BitPay Settlement object.
     * @throws SettlementQueryException SettlementQueryException class
     */
    GetSettlement(settlementId: string): Promise<SettlementInterface>;
    /**
     * Gets a detailed reconciliation report of the activity within the settlement period.
     *
     * @param settlement Settlement to generate report for.
     * @return A detailed BitPay Settlement object.
     * @throws SettlementQueryException SettlementQueryException class
     */
    GetSettlementReconciliationReport(settlement: Settlement): Promise<SettlementInterface>;
    /**
     * Create a BitPay Subscription.
     *
     * @param  subscription Subscription A Subscription object with request parameters defined.
     * @return Subscription A BitPay generated Subscription object.
     * @throws SubscriptionCreationException SubscriptionCreationException class
     */
    CreateSubscription(subscription: Subscription): Promise<SubscriptionInterface>;
    /**
     * Retrieve a BitPay subscription by subscription id using the specified facade.
     *
     * @param  subscriptionId string The id of the subscription to retrieve.
     * @return Subscription A BitPay Subscription object.
     * @throws BitPayException BitPayException class
     */
    GetSubscription(subscriptionId: string): Promise<SubscriptionInterface>;
    /**
     * Retrieve a collection of BitPay subscriptions.
     *
     * @param  status string|null The status to filter the subscriptions.
     * @return array A list of BitPay Subscription objects.
     * @throws BitPayException BitPayException class
     */
    GetSubscriptions(status: string): Promise<SubscriptionInterface[]>;
    /**
     * Update a BitPay Subscription.
     *
     * @param  subscription   Subscription A Subscription object with the parameters to update defined.
     * @param  subscriptionId string $subscriptionIdThe Id of the Subscription to update.
     * @return Subscription An updated Subscription object.
     * @throws BitPayException BitPayException class
     */
    UpdateSubscription(subscription: Subscription, subscriptionId: string): Promise<SubscriptionInterface>;
}
