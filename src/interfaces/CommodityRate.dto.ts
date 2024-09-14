export interface CommodityRate<extraParams = object> {
    name: string;
    price: number;
    date: string;
    notes?: string;
    extraParams?: extraParams | null;
}
