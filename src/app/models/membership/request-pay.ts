export type RequestPay = {
    total_amount: number;
    currency: string;
    pricing_breakdown: Array<{
        type: string;
        name: string;
        amount: number;
    }>;
}