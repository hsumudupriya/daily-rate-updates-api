import { CommodityRate } from './CommodityRate.dto';

export interface RateFetcher {
    readonly url: string;
    get(): Promise<Array<CommodityRate>>;
}
