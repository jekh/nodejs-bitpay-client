"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const index_1 = require("./index");
const Model_1 = require("./Model");
const Refund_1 = require("./Model/Invoice/Refund");
const fs = require('fs');
/**
 * @author Antonio Buedo
 * @version 2.0.2112
 * See bitpay.com/api for more information.
 * date 22.12.2021
 */
class Client {
    constructor(configFilePath, environment, privateKey, tokens) {
        this._keyUtils = new index_1.KeyUtils();
        this.GetRates = async (currency = null) => {
            let uri = currency ? "rates/" + currency : "rates";
            try {
                return await this._RESTcli.get(uri, null, false).then(ratesData => {
                    return new Model_1.Rates(ratesData, this).GetRates();
                });
            }
            catch (e) {
                throw new index_1.BitPayExceptions.RateQuery(e);
            }
        };
        try {
            // constructor with parameters
            if (configFilePath == null) {
                this._env = environment;
                this.BuildConfig(privateKey, tokens);
                this.initKeys();
                this.init();
            }
            // constructor with config file
            else {
                this.BuildConfigFromFile(configFilePath);
                this.initKeys();
                this.init();
            }
        }
        catch (e) {
            throw new index_1.BitPayExceptions.Generic(null, "failed to initiate client : " + e.message, null, e.apiCode);
        }
    }
    BuildConfigFromFile(filePath) {
        try {
            let envConfig;
            if (fs.existsSync(filePath)) {
                try {
                    let ConfigObj = JSON.parse(fs.readFileSync(filePath))['BitPayConfiguration'];
                    this._env = ConfigObj['Environment'];
                    envConfig = ConfigObj['EnvConfig'][this._env];
                }
                catch (e) {
                    throw new index_1.BitPayExceptions.Generic(null, "Error when reading configuration file", null, e.apiCode);
                }
            }
            else {
                throw new index_1.BitPayExceptions.Generic(null, "Configuration file not found");
            }
            let config = new index_1.Config();
            config.environment = this._env;
            let envTarget = {};
            envTarget[this._env] = envConfig;
            config.envConfig = envTarget;
            this._configuration = config;
        }
        catch (e) {
            throw new index_1.BitPayExceptions.Generic(null, "failed to process configuration : " + e.message, null, e.apiCode);
        }
    }
    BuildConfig(privateKey, tokens) {
        try {
            let keyHex;
            let keyFile;
            if (!fs.existsSync(privateKey)) {
                try {
                    this._ecKey = this._keyUtils.load_keypair(Buffer.from(privateKey).toString().trim());
                    keyHex = privateKey;
                }
                catch (e) {
                    throw new index_1.BitPayExceptions.Generic(null, "Private Key file not found", null, e.apiCode);
                }
            }
            else {
                try {
                    keyFile = privateKey;
                }
                catch (e) {
                    throw new index_1.BitPayExceptions.Generic(null, "Could not read private Key file", null, e.apiCode);
                }
            }
            let config = new index_1.Config();
            config.environment = this._env;
            let ApiTokens = tokens;
            let envConfig = {};
            envConfig["PrivateKeyPath"] = keyFile;
            envConfig["PrivateKey"] = keyHex;
            envConfig["ApiTokens"] = ApiTokens;
            let envTarget = {};
            envTarget[this._env] = envConfig;
            config.envConfig = envTarget;
            this._configuration = config;
        }
        catch (e) {
            throw new index_1.BitPayExceptions.Generic(null, "failed to process configuration : " + e.message, null, e.apiCode);
        }
    }
    initKeys() {
        if (this._ecKey == null) {
            let keyHex;
            try {
                let privateKeyPath = this._configuration.envConfig[this._env]["PrivateKeyPath"].toString().replace("\"", "");
                if (fs.existsSync(privateKeyPath)) {
                    this._ecKey = this._keyUtils.load_keypair(fs.readFileSync(privateKeyPath).toString());
                }
                else {
                    keyHex = this._configuration.envConfig[this._env]["PrivateKey"].toString().replace("\"", "");
                    if (keyHex) {
                        this._ecKey = this._keyUtils.load_keypair(Buffer.from(keyHex).toString().trim());
                    }
                }
            }
            catch (e) {
                throw new index_1.BitPayExceptions.Generic(null, "When trying to load private key. Make sure the configuration details are correct and the private key and tokens are valid : " + e.message, null, e.apiCode);
            }
        }
    }
    async init() {
        try {
            this._RESTcli = new index_1.RESTcli(this._env, this._ecKey);
            this.LoadAccessTokens();
            this._currenciesInfo = await this.LoadCurrencies();
        }
        catch (e) {
            throw new index_1.BitPayExceptions.Generic(null, "failed to deserialize BitPay server response (Token array) : " + e.message, null, e.apiCode);
        }
    }
    async LoadCurrencies() {
        try {
            let currenciesInfo = this._RESTcli.get("currencies/", {}, false).then(currenciesInfo => {
                return JSON.parse(currenciesInfo);
            });
            return currenciesInfo;
        }
        catch (e) {
            // No action required
        }
    }
    /**
     * Gets info for specific currency.
     *
     * @param currencyCode String Currency code for which the info will be retrieved.
     * @return Map|null
     */
    async GetCurrencyInfo(currencyCode) {
        let currencyInfo = null;
        let loop = await this.LoadCurrencies().then(ratesData => {
            ratesData.some(element => {
                currencyInfo = element;
                if (element["code"] == currencyCode) {
                    currencyInfo = element;
                    return true;
                }
            });
        });
        return currencyInfo;
    }
    GetGuid() {
        let Min = 0;
        let Max = 99999999;
        return Min + (Math.random() * ((Max - Min) + 1)) + "";
    }
    LoadAccessTokens() {
        try {
            this.ClearAccessTokenCache();
            this._tokenCache = this._configuration.envConfig[this._env]["ApiTokens"];
        }
        catch (e) {
            throw new index_1.BitPayExceptions.Generic(null, "When trying to load the tokens : " + e.message, null, e.apiCode);
        }
    }
    ClearAccessTokenCache() {
        this._tokenCache = { merchant: null, payout: null };
    }
    GetAccessToken(key) {
        try {
            return this._tokenCache[key];
        }
        catch (e) {
            throw new index_1.BitPayExceptions.Generic(null, "There is no token for the specified key : " + e.message, null, e.apiCode);
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async CreateInvoice(invoice, facade = index_1.Facade.Merchant, signRequest = true) {
        invoice.guid = this.GetGuid();
        invoice.token = this.GetAccessToken(facade);
        try {
            return await this._RESTcli.post("invoices", invoice, signRequest).then(invoiceData => {
                return JSON.parse(invoiceData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.InvoiceCreation("failed to deserialize BitPay server response (Invoice) : " + e.message, e.apiCode);
        }
    }
    async GetInvoice(invoiceId, facade = index_1.Facade.Merchant, signRequest = true) {
        const params = {
            'token': this.GetAccessToken(facade)
        };
        try {
            return await this._RESTcli.get("invoices/" + invoiceId, params, signRequest).then(invoiceData => {
                return JSON.parse(invoiceData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.InvoiceCreation("failed to deserialize BitPay server response (Invoice) : " + e.message, e.apiCode);
        }
    }
    async GetInvoices(dateStart, dateEnd, status = null, orderId = null, limit = null, offset = null) {
        let params = {};
        params["token"] = this.GetAccessToken(index_1.Facade.Merchant);
        params["dateStart"] = dateStart;
        params["dateEnd"] = dateEnd;
        if (status) {
            params["status"] = status;
        }
        if (orderId) {
            params["orderId"] = orderId;
        }
        if (limit) {
            params["limit"] = limit;
        }
        if (offset) {
            params["offset"] = offset;
        }
        try {
            return await this._RESTcli.get("invoices", params).then(invoiceData => {
                return JSON.parse(invoiceData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.InvoiceQuery("failed to deserialize BitPay server response (Invoice) : " + e.message, e.apiCode);
        }
    }
    /**
     * Request a BitPay Invoice Webhook.
     *
     * @param invoiceId String The id of the Invoice.
     * @return True if the webhook was successfully requested, false otherwise.
     * @throws BitPayException BitPayException class
     * @throws InvoiceQueryException InvoiceQueryException class
     */
    async GetInvoiceWebHook(invoiceId) {
        let invoice;
        try {
            invoice = await this.GetInvoice(invoiceId);
        }
        catch (e) {
            throw new index_1.BitPayExceptions.InvoiceQuery("Invoice with ID: " + invoiceId + " Not Found : " + e.message, e.apiCode);
        }
        const params = {
            'token': invoice.token
        };
        try {
            return await this._RESTcli.post("invoices/" + invoiceId + "/notifications", params).then(invoiceData => {
                const regex = /"/gi;
                invoiceData = invoiceData.replace(regex, '');
                return invoiceData.toLowerCase() == "success";
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.InvoiceQuery("failed to deserialize BitPay server response (InvoiceQuery) : " + e.message, e.apiCode);
        }
    }
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
    async CreateRefund(invoice, refundEmail, amount, currency) {
        let refund = new Refund_1.Refund();
        refund.token = invoice.token;
        refund.guid = this.GetGuid();
        refund.amount = amount;
        refund.refundEmail = refundEmail;
        refund.currency = currency;
        try {
            return await this._RESTcli.post("invoices/" + invoice.id + "/refunds", refund).then(refundData => {
                return JSON.parse(refundData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.RefundCreation("failed to deserialize BitPay server response (Refund) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieve a previously made refund request on a BitPay invoice.
     *
     * @param invoice  The BitPay invoice having the associated refund.
     * @param refundId The refund id for the refund to be updated with new status.
     * @return A BitPay invoice object with the associated Refund object updated.
     * @throws RefundQueryException RefundQueryException class
     */
    async GetRefund(invoice, refundId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Merchant)
        };
        try {
            return await this._RESTcli.get("invoices/" + invoice.id + "/refunds/" + refundId, params).then(refundData => {
                return JSON.parse(refundData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.RefundQuery("failed to deserialize BitPay server response (Refund) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieve all refund requests on a BitPay invoice.
     *
     * @param invoice The BitPay invoice object having the associated refunds.
     * @return A BitPay invoice object with the associated Refund objects updated.
     * @throws RefundQueryException RefundQueryException class
     */
    async GetRefunds(invoice) {
        const params = {
            'token': invoice.token
        };
        try {
            return await this._RESTcli.get("invoices/" + invoice.id + "/refunds", params).then(refundData => {
                return JSON.parse(refundData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.RefundQuery("failed to deserialize BitPay server response (Refund) : " + e.message, e.apiCode);
        }
    }
    /**
     * Cancel a previously submitted refund request on a BitPay invoice.
     *
     * @param invoice  The BitPay invoice having the associated refund to be canceled. Must have been obtained using the merchant facade.
     * @param refund The refund to be canceled.
     * @return True if the refund was successfully canceled, false otherwise.
     * @throws RefundCancellationException RefundCancellationException class
     */
    async CancelRefund(invoice, refund) {
        const params = {
            'token': refund.token
        };
        try {
            return await this._RESTcli.delete("invoices/" + invoice.id + "/refunds/" + refund.id, params).then(refundData => {
                const regex = /"/gi;
                refundData = refundData.replace(regex, '');
                return refundData.toLowerCase() == "success";
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.RefundCreation("failed to deserialize BitPay server response (Refund) : " + e.message, e.apiCode);
        }
    }
    /**
     * Create a BitPay Bill.
     *
     * @param bill        A Bill object with request parameters defined.
     * @return A BitPay generated Bill object.
     * @throws BitPayException       BitPayException class
     * @throws BillCreationException BillCreationException class
     */
    async CreateBill(bill) {
        bill.token = this.GetAccessToken(index_1.Facade.Merchant);
        try {
            return await this._RESTcli.post("bills", bill).then(billData => {
                return JSON.parse(billData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.BillCreation("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieve a collection of BitPay bills.
     *
     * @param status The status to filter the bills.
     * @return A list of BitPay Bill objects.
     * @throws BitPayException    BitPayException class
     * @throws BillQueryException BillQueryException class
     */
    async GetBills(status = null) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Merchant)
        };
        if (status) {
            params["status"] = status;
        }
        try {
            return await this._RESTcli.get("bills", params).then(billData => {
                return JSON.parse(billData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.BillQuery("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieve a BitPay bill by bill id using the specified facade.
     *
     * @param billId      The id of the bill to retrieve.
     * @return A BitPay Bill object.
     * @throws BitPayException    BitPayException class
     * @throws BillQueryException BillQueryException class
     */
    async GetBill(billId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Merchant)
        };
        try {
            return await this._RESTcli.get("bills/" + billId, params).then(billData => {
                return JSON.parse(billData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.BillQuery("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }
    /**
     * Update a BitPay Bill.
     *
     * @param bill   A Bill object with the parameters to update defined.
     * @param billId The Id of the Bill to udpate.
     * @return An updated Bill object.
     * @throws BitPayException     BitPayException class
     * @throws BillUpdateException BillUpdateException class
     */
    async UpdateBill(bill, billId) {
        try {
            return await this._RESTcli.update("bills/" + billId, bill).then(billData => {
                return JSON.parse(billData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.BillUpdate("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }
    /**
     * Deliver a BitPay Bill.
     *
     * @param billId      The id of the requested bill.
     * @param billToken   The token of the requested bill.
     * @return A response status returned from the API.
     * @throws BillDeliveryException BillDeliveryException class
     */
    async DeliverBill(billId, billToken) {
        const params = {
            'token': billToken
        };
        try {
            return await this._RESTcli.post("bills/" + billId + "/deliveries", params).then(billData => {
                return (JSON.parse(billData) == "Success");
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.BillDelivery("failed to deserialize BitPay server response (Bill) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieve a list of ledgers by date range using the merchant facade.
     *
     * @param currency  The three digit currency string for the ledger to retrieve.
     * @param dateStart The first date for the query filter.
     * @param dateEnd   The last date for the query filter.
     * @return A Ledger object populated with the BitPay ledger entries list.
     * @throws LedgerQueryException LedgerQueryException class
     */
    async GetLedger(currency, dateStart, dateEnd) {
        let params = {};
        params["token"] = this.GetAccessToken(index_1.Facade.Merchant);
        if (currency) {
            params["currency"] = currency;
        }
        if (dateStart) {
            params["startDate"] = dateStart;
        }
        if (dateEnd) {
            params["endDate"] = dateEnd;
        }
        try {
            return await this._RESTcli.get("ledgers/" + currency, params).then(ledgerData => {
                return JSON.parse(ledgerData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.LedgerQuery("failed to deserialize BitPay server response (Ledger) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieve a list of ledgers using the merchant facade.
     *
     * @return A list of Ledger objects populated with the currency and current balance of each one.
     * @throws LedgerQueryException LedgerQueryException class
     */
    async GetLedgers() {
        let params = {};
        params["token"] = this.GetAccessToken(index_1.Facade.Merchant);
        try {
            return await this._RESTcli.get("ledgers", params).then(ledgerData => {
                return JSON.parse(ledgerData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.LedgerQuery("failed to deserialize BitPay server response (Ledger) : " + e.message, e.apiCode);
        }
    }
    /**
     * Submit BitPay Payout Recipients.
     *
     * @param recipients PayoutRecipients A PayoutRecipients object with request parameters defined.
     * @return array A list of BitPay PayoutRecipients objects..
     * @throws BitPayException BitPayException class
     * @throws PayoutRecipientCreationException PayoutRecipientCreationException class
     */
    async SubmitPayoutRecipients(recipients) {
        recipients.token = this.GetAccessToken(index_1.Facade.Payout);
        //recipients.guid = this.GetGuid();
        try {
            return await this._RESTcli.post("recipients", recipients).then(recipientsData => {
                return JSON.parse(recipientsData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutRecipientCreation("failed to deserialize BitPay server response (PayoutRecipients) : " + e.message, e.apiCode);
        }
    }
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
    async GetPayoutRecipients(status, limit, offset) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        if (status) {
            params["status"] = status;
        }
        if (limit) {
            params["limit"] = limit;
        }
        if (offset) {
            params["offset"] = offset;
        }
        try {
            return await this._RESTcli.get("recipients", params).then(recipientsData => {
                return JSON.parse(recipientsData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutRecipientQuery("failed to deserialize BitPay server response (PayoutRecipients) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieve a BitPay payout recipient.
     *
     * @param recipientId String The id of the recipient to retrieve.
     * @return PayoutRecipient A BitPay PayoutRecipient object.
     * @throws BitPayException BitPayException class
     * @throws PayoutRecipientQueryException PayoutRecipientQueryException class
     */
    async GetPayoutRecipient(recipientId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        try {
            return await this._RESTcli.get("recipients/" + recipientId, params).then(recipientData => {
                return JSON.parse(recipientData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutRecipientQuery("failed to deserialize BitPay server response (PayoutRecipient) : " + e.message, e.apiCode);
        }
    }
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
    async UpdatePayoutRecipient(recipientId, label, notificationURL) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        if (label) {
            params["label"] = label;
        }
        if (notificationURL) {
            params["notificationURL"] = notificationURL;
        }
        try {
            return await this._RESTcli.update("recipients/" + recipientId, params).then(recipientData => {
                return JSON.parse(recipientData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutRecipientUpdate("failed to deserialize BitPay server response (PayoutRecipient) : " + e.message, e.apiCode);
        }
    }
    /**
     * Cancel a previously submitted refund request on a BitPay invoice.
     *
     * @param recipientId The Payout Recipient to be deleted.
     * @return True if the recipient was successfully deleted, false otherwise.
     * @throws PayoutRecipientCancellationException PayoutRecipientCancellationException class
     */
    async DeletePayoutRecipient(recipientId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        try {
            return await this._RESTcli.delete("recipients/" + recipientId, params).then(recipientData => {
                return JSON.parse(recipientData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutRecipientCancellation("failed to deserialize BitPay server response (PayoutRecipient) : " + e.message, e.apiCode);
        }
    }
    /**
     * Request a BitPay payout recipient Webhook.
     *
     * @param recipientId String The id of the recipient.
     * @return True if the webhook was successfully requested, false otherwise.
     * @throws BitPayException BitPayException class
     * @throws PayoutRecipientNotificationException PayoutRecipientNotificationException class
     */
    async GetPayoutRecipientWebHook(recipientId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        try {
            return await this._RESTcli.post("recipients/" + recipientId + "/notifications", params).then(recipientData => {
                return JSON.parse(recipientData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutRecipientNotification("failed to deserialize BitPay server response (PayoutRecipient) : " + e.message, e.apiCode);
        }
    }
    /**
     * Submit a BitPay Payout.
     *
     * @param payout A Payout object with request parameters defined.
     * @return A BitPay generated Payout object.
     * @throws BitPayException         BitPayException class
     * @throws PayoutCreationException PayoutCreationException class
     */
    async SubmitPayout(payout) {
        let currencyInfo = await this.GetCurrencyInfo(payout.currency);
        let precision = !currencyInfo ? 2 : parseInt(currencyInfo["precision"]);
        payout.amount = parseFloat(payout.amount.toFixed(precision));
        payout.token = this.GetAccessToken(index_1.Facade.Payout);
        try {
            return await this._RESTcli.post("payouts", payout).then(PayoutData => {
                return JSON.parse(PayoutData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutCreation("failed to deserialize BitPay server response (Payout) : " + e.message, e.apiCode);
        }
    }
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
    async GetPayouts(startDate, endDate, status, reference, limit, offset) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        if (startDate) {
            params["startDate"] = startDate;
        }
        if (endDate) {
            params["endDate"] = endDate;
        }
        if (status) {
            params["status"] = status;
        }
        if (reference) {
            params["reference"] = reference;
        }
        if (limit) {
            params["limit"] = limit;
        }
        if (offset) {
            params["offset"] = offset;
        }
        try {
            return await this._RESTcli.get("payouts", params).then(payoutData => {
                return JSON.parse(payoutData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutQuery("failed to deserialize BitPay server response (Payout) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieve a BitPay payout by payout id using.  The client must have been previously authorized for the payout facade.
     *
     * @param payoutId The id of the batch to retrieve.
     * @return A BitPay PayoutBatch object.
     * @throws BitPayException      BitPayException class
     * @throws PayoutQueryException PayoutQueryException class
     */
    async GetPayout(payoutId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        try {
            return await this._RESTcli.get("payouts/" + payoutId, params).then(payoutData => {
                return JSON.parse(payoutData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutQuery("failed to deserialize BitPay server response (Payout) : " + e.message, e.apiCode);
        }
    }
    /**
     * Cancel a BitPay Payout.
     *
     * @param payoutId string The id of the payout to cancel.
     * @return Payout A BitPay generated Payout object.
     * @throws PayoutDeleteException BitPayException class
     */
    async CancelPayout(payoutId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        try {
            return await this._RESTcli.delete("payouts/" + payoutId, params).then(responseData => {
                return JSON.parse(responseData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutDelete("failed to deserialize BitPay server response (PayoutObject) : " + e.message, e.apiCode);
        }
    }
    /**
     * Notify BitPay Payout.
     *
     * @param  payoutId string The id of the Payout to notify.
     * @return True if the notification was successfully sent, false otherwise.
     * @throws PayoutNotificationException BitPayException class
     */
    async RequestPayoutNotification(payoutId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        try {
            return await this._RESTcli.post("payouts/" + payoutId + "/notifications", params).then(responseData => {
                return JSON.parse(responseData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutNotification("failed to deserialize BitPay server response (PayoutObject) : " + e.message, e.apiCode);
        }
    }
    /**
     * Submit a BitPay Payout batch.
     *
     * @param batch A PayoutBatch object with request parameters defined.
     * @return A BitPay generated PayoutBatch object.
     * @throws BitPayException         BitPayException class
     * @throws PayoutBatchCreationException PayoutBatchCreationException class
     */
    async SubmitPayoutBatch(batch) {
        let currencyInfo = await this.GetCurrencyInfo(batch.currency);
        let precision = !currencyInfo ? 2 : parseInt(currencyInfo["precision"]);
        let amount = 0.0;
        batch.instructions.forEach(instruction => {
            amount += instruction.amount;
        });
        batch.amount = parseFloat(amount.toFixed(precision));
        batch.token = this.GetAccessToken(index_1.Facade.Payout);
        try {
            return await this._RESTcli.post("payoutBatches", batch).then(PayoutBatchData => {
                return JSON.parse(PayoutBatchData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutBatchCreation("failed to deserialize BitPay server response (PayoutBatch) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieve a BitPay payout batch by batch id using.  The client must have been previously authorized for the payout facade.
     *
     * @param batchId The id of the batch to retrieve.
     * @return A BitPay PayoutBatch object.
     * @throws BitPayException      BitPayException class
     * @throws PayoutBatchQueryException PayoutBatchQueryException class
     */
    async GetPayoutBatch(payoutBatchId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        try {
            return await this._RESTcli.get("payoutBatches/" + payoutBatchId, params).then(payoutBatchData => {
                return JSON.parse(payoutBatchData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutBatchQuery("failed to deserialize BitPay server response (PayoutBatch) : " + e.message, e.apiCode);
        }
    }
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
    async GetPayoutBatches(startDate, endDate, status, limit, offset) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        if (startDate) {
            params["startDate"] = startDate;
        }
        if (endDate) {
            params["endDate"] = endDate;
        }
        if (status) {
            params["status"] = status;
        }
        if (limit) {
            params["limit"] = limit;
        }
        if (offset) {
            params["offset"] = offset;
        }
        try {
            return await this._RESTcli.get("payoutBatches", params).then(payoutBatchData => {
                return JSON.parse(payoutBatchData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutBatchQuery("failed to deserialize BitPay server response (PayoutBatch) : " + e.message, e.apiCode);
        }
    }
    /**
     * Cancel a BitPay Payout batch.
     *
     * @param payoutBatchId The id of the batch to cancel.
     * @return A BitPay generated PayoutBatch object.
     * @throws BitPayException      BitPayException class
     * @throws PayoutBatchCancellationException PayoutBatchCancellationException class
     */
    async CancelPayoutBatch(payoutBatchId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        try {
            return await this._RESTcli.delete("payoutBatches/" + payoutBatchId, params).then(responseData => {
                return JSON.parse(responseData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutBatchCancellation("failed to deserialize BitPay server response (PayoutBatch) : " + e.message, e.apiCode);
        }
    }
    /**
     * Notify BitPay Payout Batch.
     *
     * @param  payoutBatchId string The id of the Payout to notify.
     * @return True if the notification was successfully sent, false otherwise.
     * @throws BitPayException      BitPayException class
     * @throws PayoutBatchNotificationException PayoutBatchNotificationException class
     */
    async RequestPayoutBatchNotification(payoutBatchId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Payout)
        };
        try {
            return await this._RESTcli.post("payoutBatches/" + payoutBatchId + "/notifications", params).then(responseData => {
                return JSON.parse(responseData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutBatchNotification("failed to deserialize BitPay server response (PayoutObject) : " + e.message, e.apiCode);
        }
    }
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
    async GetSettlements(currency, dateStart, dateEnd, status, limit, offset) {
        let params = {};
        params["token"] = this.GetAccessToken(index_1.Facade.Merchant);
        if (currency) {
            params["currency"] = currency;
        }
        if (dateStart) {
            params["dateStart"] = dateStart;
        }
        if (dateEnd) {
            params["dateEnd"] = dateEnd;
        }
        if (currency) {
            params["currency"] = currency;
        }
        if (status) {
            params["status"] = status;
        }
        if (limit) {
            params["limit"] = limit;
        }
        if (offset) {
            params["offset"] = offset;
        }
        try {
            return await this._RESTcli.get("settlements", params).then(settlementData => {
                return JSON.parse(settlementData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.SettlementQuery("failed to deserialize BitPay server response (Settlement) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieves a summary of the specified settlement.
     *
     * @param settlementId Settlement Id.
     * @return A BitPay Settlement object.
     * @throws SettlementQueryException SettlementQueryException class
     */
    async GetSettlement(settlementId) {
        let params = {};
        params["token"] = this.GetAccessToken(index_1.Facade.Merchant);
        try {
            return await this._RESTcli.get("settlements/" + settlementId, params).then(settlementData => {
                return JSON.parse(settlementData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.SettlementQuery("failed to deserialize BitPay server response (Settlement) : " + e.message, e.apiCode);
        }
    }
    /**
     * Gets a detailed reconciliation report of the activity within the settlement period.
     *
     * @param settlement Settlement to generate report for.
     * @return A detailed BitPay Settlement object.
     * @throws SettlementQueryException SettlementQueryException class
     */
    async GetSettlementReconciliationReport(settlement) {
        let params = {};
        params["token"] = settlement.token;
        try {
            return await this._RESTcli.get("settlements/" + settlement.id + "/reconciliationReport", params).then(settlementData => {
                return JSON.parse(settlementData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.SettlementQuery("failed to deserialize BitPay server response (Settlement) : " + e.message, e.apiCode);
        }
    }
    /**
     * Create a BitPay Subscription.
     *
     * @param  subscription Subscription A Subscription object with request parameters defined.
     * @return Subscription A BitPay generated Subscription object.
     * @throws SubscriptionCreationException SubscriptionCreationException class
     */
    async CreateSubscription(subscription) {
        subscription.token = this.GetAccessToken(index_1.Facade.Merchant);
        try {
            return await this._RESTcli.post("subscriptions", subscription).then(subscriptionsData => {
                return JSON.parse(subscriptionsData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.SubscriptionCreation("failed to deserialize BitPay server response (Subscription) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieve a BitPay subscription by subscription id using the specified facade.
     *
     * @param  subscriptionId string The id of the subscription to retrieve.
     * @return Subscription A BitPay Subscription object.
     * @throws BitPayException BitPayException class
     */
    async GetSubscription(subscriptionId) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Merchant)
        };
        try {
            return await this._RESTcli.get("subscriptions/" + subscriptionId, params).then(subscriptionData => {
                return JSON.parse(subscriptionData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.SubscriptionQuery("failed to deserialize BitPay server response (Subscription) : " + e.message, e.apiCode);
        }
    }
    /**
     * Retrieve a collection of BitPay subscriptions.
     *
     * @param  status string|null The status to filter the subscriptions.
     * @return array A list of BitPay Subscription objects.
     * @throws BitPayException BitPayException class
     */
    async GetSubscriptions(status) {
        const params = {
            'token': this.GetAccessToken(index_1.Facade.Merchant)
        };
        if (status) {
            params["status"] = status;
        }
        try {
            return await this._RESTcli.get("subscriptions", params).then(subscriptionsData => {
                return JSON.parse(subscriptionsData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.SubscriptionQuery("failed to deserialize BitPay server response (Subscriptions) : " + e.message, e.apiCode);
        }
    }
    /**
     * Update a BitPay Subscription.
     *
     * @param  subscription   Subscription A Subscription object with the parameters to update defined.
     * @param  subscriptionId string $subscriptionIdThe Id of the Subscription to update.
     * @return Subscription An updated Subscription object.
     * @throws BitPayException BitPayException class
     */
    async UpdateSubscription(subscription, subscriptionId) {
        let subscriptionObj;
        try {
            subscriptionObj = await this.GetSubscription(subscriptionId);
        }
        catch (e) {
            throw new index_1.BitPayExceptions.PayoutQuery("Subscription with ID: " + subscriptionId + " Not Found : " + e.message, e.apiCode);
        }
        subscription.token = subscriptionObj.token;
        try {
            return await this._RESTcli.update("subscriptions/" + subscriptionId, subscription).then(subscriptionData => {
                return JSON.parse(subscriptionData);
            });
        }
        catch (e) {
            throw new index_1.BitPayExceptions.SubscriptionUpdate("failed to deserialize BitPay server response (Subscription) : " + e.message, e.apiCode);
        }
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map