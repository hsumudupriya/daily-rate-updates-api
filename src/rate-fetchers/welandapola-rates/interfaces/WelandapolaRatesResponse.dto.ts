export interface WelandapolaRatesResponse {
    data: Array<{
        id: number;
        attributes: WelandapolaRatesResponseAttributes;
    }>;
}

export interface WelandapolaRatesResponseAttributes {
    name: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    market: string;
    date: string;
    type: string;
}
