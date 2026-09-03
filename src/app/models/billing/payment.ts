export type Payment = {
    id: number;
    type: string;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    payer_firstname: string;
    payer_lastname: string;
    payer_email: string;
    payed_at: Date;
}