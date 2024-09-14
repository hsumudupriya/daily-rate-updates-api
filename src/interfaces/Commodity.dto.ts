export interface Commodity<extraParams = object> {
    name: string; // 24k Sovereign
    price: number; // 208000
    notes?: string; // "1 Sovereign = 8 Grams"
    date: string; // 2024-09-14
    extraParams: extraParams; // { "minSingleTransAmount":5000.00, "dynamicMaxSingleTransAmount":30819.18 }
}
