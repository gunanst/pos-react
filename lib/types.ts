export type Sale = {
    id: number; // 🔧 dari string → number
    createdAt: Date;
    items: {
        id: number;
        saleId: number;
        productId: number;
        quantity: number;
        product: {
            id: number;
            name: string;
            price: number;
            stock: number;
            image: string | null;
        };
    }[];
};
export type SaleItem = {
    id: number;
    saleId: number;
    productId: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        stock: number;
        image: string | null;
    };
};
