import { CommodityRate } from '../interfaces/CommodityRate.dto';
import { FetchingError } from '../interfaces/FetchingError.dto';
import { RateFetcher } from '../interfaces/RateFetcher.interface';
import axios, { AxiosError } from 'axios';
import { P2pRatesResponse } from './interfaces/P2pRatesResponse.dto';
import { P2pRatesExtraParams } from './interfaces/P2pRatesExtraParams.dto';

export default class P2pRatesFetcher implements RateFetcher {
    url = 'https://nisal.me/p2p/post.php';
    readonly asset: string;
    readonly fiat: string;
    readonly tradeType: string;

    constructor(
        asset: string = 'USDT',
        fiat: string = 'LKR',
        tradeType: string = 'BUY'
    ) {
        this.asset = asset;
        this.fiat = fiat;
        this.tradeType = tradeType;
    }

    get(): Promise<Array<CommodityRate>> {
        return axios
            .get<Array<P2pRatesResponse>>(this.url, {
                params: {
                    asset: this.asset,
                    fiat: this.fiat,
                    tradeType: this.tradeType,
                },
            })
            .then((response) => {
                let rates: Array<CommodityRate<P2pRatesExtraParams>> = [];

                response.data.forEach((item) => {
                    rates.push({
                        name: this.asset + ' to ' + this.fiat,
                        price: item.price,
                        date: new Date().toISOString().split('T')[0], // Today's date.
                        extraParams: {
                            asset: this.asset,
                            fiat: this.fiat,
                            tradeType: this.tradeType,
                            minSingleTransAmount: item.minSingleTransAmount,
                            dynamicMaxSingleTransAmount:
                                item.dynamicMaxSingleTransAmount,
                            nickName: item.nickName,
                        },
                    });
                });

                return rates;
            })
            .catch(function (error: Error | AxiosError) {
                let FetchingError: FetchingError = {
                    message: error.message,
                    name: error.name,
                };

                if (error instanceof AxiosError) {
                    FetchingError.code = error.code;
                    FetchingError.status = error.status;
                }

                throw FetchingError;
            });
    }
}
