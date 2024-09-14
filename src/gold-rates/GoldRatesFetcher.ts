import { Commodity } from '../interfaces/Commodity.dto';
import { FetchingError } from '../interfaces/FetchingError.dto';
import { RateFetcher } from '../interfaces/RateFetcher.interface';
import axios, { AxiosError } from 'axios';
import { GoldRatesResponse } from './interfaces/GoldRatesResponse.dto';
import { GoldRatesExtraParams } from './interfaces/GoldRatesExtraParams.dto';

export default class GoldRatesFetcher implements RateFetcher {
    url = 'https://ceyloncash.com/api/goldrates';

    get(): Promise<Array<Commodity>> {
        return axios
            .get<GoldRatesResponse>(this.url)
            .then(function (response) {
                let rates: Array<Commodity<GoldRatesExtraParams>> = [];
                rates.push({
                    name: '24k_sovereign',
                    price: response.data.rates['24k_sovereign'],
                    notes: response.data.notes,
                    date: response.data.date,
                    extraParams: {
                        description: response.data.description,
                    },
                });
                rates.push({
                    name: '22k_sovereign',
                    price: response.data.rates['22k_sovereign'],
                    notes: response.data.notes,
                    date: response.data.date,
                    extraParams: {
                        description: response.data.description,
                    },
                });

                return rates;
            })
            .catch(function (error: Error | AxiosError) {
                // TODO: Asynchronously log the error. May be in Sentry.

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
