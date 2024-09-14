import GoldRatesFetcher from '../gold-rates/GoldRatesFetcher';
import { RateFetcher } from '../interfaces/RateFetcher.interface';
import CommodityRate from '../../database/models/commodityrate';
import P2pRatesFetcher from '../p2p-rates/P2pRatesFetcher';
import WelandapolaRatesFetcher from '../welandapola-rates/WelandapolaRatesFetcher';

export function fetchRates() {
    let today = new Date().toISOString().split('T')[0];

    // Add an instance of any new RateFetcher to fetch rates.
    let rateFetchers: Array<RateFetcher> = [
        new GoldRatesFetcher(),
        new P2pRatesFetcher(),
        // new WelandapolaRatesFetcher(today, today),
        new WelandapolaRatesFetcher('2024-09-11', '2024-09-11'),
    ];

    // This forEach will iterate over each RateFetcher instance and call its get() method.
    rateFetchers.forEach((rateFetcher) => {
        try {
            let rates = rateFetcher.get();

            rates.then((rates) => {
                // This forEach will iterate over each fetched rate and persist it in the database.
                rates.forEach((rate) => {
                    // Find if a rate already exists in the database for the given name and date.
                    CommodityRate.findOne({
                        where: {
                            name: rate.name,
                            date: rate.date,
                        },
                    }).then((commodityRate) => {
                        if (commodityRate) {
                            // If a rate already exists, update it.
                            commodityRate.update(rate);
                        } else {
                            // Else create one.
                            CommodityRate.create(rate);
                        }
                    });
                });
            });
        } catch (error) {
            // TODO: Log the error
        }
    });
}
