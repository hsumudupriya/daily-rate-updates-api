import GoldRatesFetcher from '../rate_fetchers/gold_rates/GoldRatesFetcher';
import RateFetcher from '../interfaces/RateFetcher.interface';
import CommodityRate from '../database/models/CommodityRate.model';
import P2pRatesFetcher from '../rate_fetchers/p2p_rates/P2pRatesFetcher';
import WelandapolaRatesFetcher from '../rate_fetchers/welandapola_rates/WelandapolaRatesFetcher';
import axios from 'axios';
import { default as CommodityRateDto } from '../interfaces/CommodityRate.dto';
import { setTimeout } from 'timers/promises';

export default class RatesFetcherService {
    private rateFetchers: Array<RateFetcher>;

    constructor(rateFetchers?: Array<RateFetcher>) {
        let today = new Date().toISOString().split('T')[0];

        // Add an instance of any new RateFetcher to fetch rates.
        this.rateFetchers = rateFetchers ?? [
            new GoldRatesFetcher(),
            new P2pRatesFetcher(),
            new WelandapolaRatesFetcher(today, today),
        ];
    }

    fetchRates(): Promise<(void | Promise<CommodityRate>[])[]> {
        const commodityRates: Promise<void | Promise<CommodityRate>[]>[] = [];

        // This forEach will iterate over each RateFetcher instances
        // and call the fetchRatesWithDelay() function passing the instance as the 1st argument.
        this.rateFetchers.forEach((rateFetcher) => {
            try {
                commodityRates.push(this.fetchRatesWithDelay(rateFetcher));
            } catch (error) {
                // TODO: Log the error
                console.error(error);
            }
        });

        return Promise.all(commodityRates);
    }

    /**
     *
     * @param rateFetcher
     * @param delay Delay in minutes
     */
    async fetchRatesWithDelay(
        rateFetcher: RateFetcher,
        delay: number = 0
    ): Promise<void | Promise<CommodityRate>[]> {
        if (delay > 0) {
            await setTimeout(delay * 60 * 1000);
        }

        return rateFetcher
            .get()
            .then((resolvedRates) => {
                const commodityRates: Promise<CommodityRate>[] = [];

                // This forEach will iterate over each fetched rate and persist it in the database.
                resolvedRates.forEach((rate) => {
                    // Save the rate in the database.
                    const dbRate = this.saveCommodityRate(rate);

                    commodityRates.push(dbRate);
                });

                return commodityRates;
            })
            .catch((error: Error) => {
                // If an error occurs in fetching the rates try after an exponential delay.
                // 1st try is with 0 min delay.
                // 2nd try is with 1 min delay.
                // 3rd try is with 5 mins delay.
                // Only 3 tries are made.
                if (delay === 0 || delay < 5) {
                    if (delay === 0) {
                        this.fetchRatesWithDelay(rateFetcher, 1);
                    } else {
                        this.fetchRatesWithDelay(rateFetcher, delay * 5);
                    }
                }

                // TODO: Log the error.
                console.error(
                    new Date().toISOString().split('T')[1],
                    error.message,
                    error.stack
                );
            });
    }

    private saveCommodityRate(
        rateDto: CommodityRateDto
    ): Promise<CommodityRate> {
        // Find if a rate already exists in the database for the given name and date.
        return CommodityRate.findOne({
            where: {
                name: rateDto.name,
                date: rateDto.date,
            },
        }).then((commodityRate: CommodityRate | null) => {
            let dbCommodityRate: Promise<CommodityRate>;

            if (commodityRate) {
                // If a rate already exists, update it.
                dbCommodityRate = commodityRate.update(rateDto);
            } else {
                // Else create one.
                dbCommodityRate = CommodityRate.create(rateDto);
            }

            return dbCommodityRate;
        });
    }
}

axios.interceptors.response.use((response) => {
    // TODO: Log the response.

    return response;
});
