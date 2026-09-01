export type Payment = {
    id: number;
    type: string;
    amount: number;
    currency: string;
    status: string;
    payer_firstname: string;
    payer_lastname: string;
    payer_email: string;
}