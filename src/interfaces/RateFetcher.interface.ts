import CommodityRate from './CommodityRate.dto';

export default interface RateFetcher {
    readonly url: string;
    get(): Promise<Array<CommodityRate>>;
}
