export default interface GoldRatesResponse {
    success: boolean;
    status: number;
    message: string;
    description: string;
    date: string;
    rates: { '24k_sovereign': number; '22k_sovereign': number };
    note: string;
}
