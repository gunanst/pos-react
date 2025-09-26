export type ReceiptItem = {
    id: number;
    name: string;
    qty: number;
    price: number;
};

export type ReceiptData = {
    items: ReceiptItem[];
    total: number;
    cash: number;
    change: number;
    cashierName: string;
    datetime: string;
    receiptNumber: string;
};
