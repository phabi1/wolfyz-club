export type Pay = {
    currency: string;
    participants_count: number;
    pricing_breakdown: {
        type: string;
        participant_index: number | null;
        amount: number;
        name: string;
        currency: string;
    }[];
    total_amount: number;
}