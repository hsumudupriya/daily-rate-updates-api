import { CommodityRate } from '../interfaces/CommodityRate.dto';
import { FetchingError } from '../interfaces/FetchingError.dto';
import { RateFetcher } from '../interfaces/RateFetcher.interface';
import axios, { AxiosError } from 'axios';
import { WelandapolaRatesResponse } from './interfaces/WelandapolaRatesResponse.dto';
import { WelandapolaRatesExtraParams } from './interfaces/WelandapolaRatesExtraParams.dto';

export default class WelandapolaRatesFetcher implements RateFetcher {
    url = 'https://api.welandapola.com/api/prices';
    private bearer_token: string =
        '962242ef091a8927de29d170bb46ac9b303f9644ffd6e849cc46982edd7d3056f4e2aa544a8ed7c8547ec06eb80e571d0380a4efa17ac3c92a2bfdcf6f8271a37b9ceda95cb1550ef0b45c46a7f9cff8b9d8b54fb9f5bf6d577c93d41f72c74e8248fde0d10f04abcddfcc3c12df1311899d46b7825c99c57a5f8d50f1da2fdd';
    readonly dateFrom: string;
    readonly dateTo: string;
    readonly market: string;
    readonly eq: string;

    constructor(
        dateFrom?: string | null,
        dateTo?: string | null,
        market: string = 'pettah',
        eq: string = 'retail'
    ) {
        let today = new Date().toISOString().split('T')[0];

        this.dateFrom = dateFrom ?? today;
        this.dateTo = dateTo ?? today;
        this.market = market;
        this.eq = eq;
    }

    get(): Promise<Array<CommodityRate>> {
        return axios
            .get<WelandapolaRatesResponse>(this.url, {
                headers: {
                    authorization: 'Bearer ' + this.bearer_token,
                },
                params: {
                    filters: {
                        date: {
                            $between: [this.dateFrom, this.dateTo],
                        },
                        market: {
                            $eq: this.market,
                        },
                        type: {
                            $eq: this.eq,
                        },
                    },
                    pagination: {
                        pageSize: 1000,
                    },
                },
            })
            .then(function (response) {
                let rates: Array<CommodityRate<WelandapolaRatesExtraParams>> =
                    [];

                response.data.data.forEach((item) => {
                    rates.push({
                        name: item.attributes.name,
                        price: item.attributes.price,
                        date: item.attributes.date,
                        extraParams: {
                            id: item.id,
                            market: item.attributes.market,
                            type: item.attributes.type,
                            createdAt: item.attributes.createdAt,
                            updatedAt: item.attributes.updatedAt,
                            publishedAt: item.attributes.publishedAt,
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
