import { Commodity } from './Commodity.dto';

export interface RateFetcher {
    readonly url: string;
    get(): Promise<Array<Commodity>>;
}
