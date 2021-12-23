export interface InvoiceTransaction {
    amount: number;
    confirmations: number;
    time?: Date;
    receivedTime: string;
    txid: string;
    exRates?: {
        [currency: string]: number;
    };
}
