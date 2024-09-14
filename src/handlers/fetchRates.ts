import GoldRatesFetcher from '../rate-fetchers/gold-rates/GoldRatesFetcher';
import RateFetcher from '../interfaces/RateFetcher.interface';
import CommodityRate from '../database/models/commodityrate';
import P2pRatesFetcher from '../rate-fetchers/p2p-rates/P2pRatesFetcher';
import WelandapolaRatesFetcher from '../rate-fetchers/welandapola-rates/WelandapolaRatesFetcher';

/**
 *
 * @param rateFetcher
 * @param delay Delay in minutes
 */
function fetchRatesWithDelay(rateFetcher: RateFetcher, delay: number = 0) {
    setTimeout(() => {
        let rates = rateFetcher.get();

        rates
            .then((rates) => {
                // This forEach will iterate over each fetched rate and persist it in the database.
                rates.forEach((rate) => {
                    // Find if a rate already exists in the database for the given name and date.
                    CommodityRate.findOne({
                        where: {
                            name: rate.name,
                            date: rate.date,
                        },
                    })
                        .then((commodityRate) => {
                            if (commodityRate) {
                                // If a rate already exists, update it.
                                commodityRate.update(rate);
                            } else {
                                // Else create one.
                                CommodityRate.create(rate);
                            }
                        })
                        .catch((error) => {
                            // TODO: Log the error.
                        });
                });
            })
            .catch((error) => {
                // If an error occurs in fetching the rates try after an exponential delay.
                // 1st try is with 0 min delay.
                // 2nd try is with 1 min delay.
                // 3rd try is with 5 mins delay.
                // Only 3 tries are made.
                if (delay === 0 || delay < 5) {
                    if (delay === 0) {
                        fetchRatesWithDelay(rateFetcher, 1);
                    } else {
                        fetchRatesWithDelay(rateFetcher, delay * 5);
                    }
                }

                // TODO: Log the error.
            });
    }, delay * 60 * 1000);
}

export default function fetchRates() {
    let today = new Date().toISOString().split('T')[0];

    // Add an instance of any new RateFetcher to fetch rates.
    let rateFetchers: Array<RateFetcher> = [
        new GoldRatesFetcher(),
        new P2pRatesFetcher(),
        new WelandapolaRatesFetcher(today, today),
        // new WelandapolaRatesFetcher('2024-09-11', '2024-09-11'),
    ];

    // This forEach will iterate over each RateFetcher instance
    // and call the fetchRatesWithDelay() function passing the instance as the 1st argument.
    rateFetchers.forEach((rateFetcher) => {
        try {
            fetchRatesWithDelay(rateFetcher);
        } catch (error) {
            // TODO: Log the error
        }
    });
}
