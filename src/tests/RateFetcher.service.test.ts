import axios from 'axios';
import RatesFetcherService from '../services/RatesFetcher.service';
import GoldRatesFetcher from '../rate_fetchers/gold_rates/GoldRatesFetcher';
import CommodityRate from '../database/models/CommodityRate.model';
import sequelize from '../database/connection';
import { setTimeout } from 'timers/promises';

beforeEach(() => {
    jest.resetAllMocks();

    // Truncate all the database table before running each test.
    sequelize.truncate({
        cascade: true,
        restartIdentity: true,
    });
});

// Mock the setTimeout function.
jest.mock('timers/promises', () => ({
    setTimeout: jest.fn(),
}));

afterAll(() => {
    // Close the connections to the database after running the tests.
    sequelize.close();
});

describe('RateFetcher.service tests', () => {
    let ratesFetcher: RatesFetcherService;

    beforeEach(() => {
        // Create an instance of the RatesFetcherService only with the GoldRatesFetcher.
        ratesFetcher = new RatesFetcherService([new GoldRatesFetcher()]);
    });

    test('should fetch the rates and create datebase records', async () => {
        // Assert the database do not have any record.
        expect((await CommodityRate.findAll()).length).toBe(0);

        // Mock the response of the axios GET request.
        const response = {
            data: {
                success: true,
                status: 200,
                message: 'OK',
                description: 'Gold Rates - Sri Lanka',
                date: '2024-09-14',
                rates: {
                    '24k_sovereign': 209000,
                    '22k_sovereign': 193300,
                },
                note: '1 Sovereign = 8 Grams',
            },
        };
        const promiseResponse = Promise.resolve(response);
        jest.spyOn(axios, 'get').mockReturnValue(promiseResponse);

        let rates: (void | Promise<CommodityRate>)[] = (
            await ratesFetcher.fetchRates()
        ).flat();

        // Wait for all promises to settle (resolve or reject)
        await promiseResponse;
        const resolvedRates = await Promise.all(rates);

        // Assertions
        // API endpoint was called.
        expect(axios.get).toHaveBeenCalledTimes(1);
        // 2 records were saved in the database.
        expect((await CommodityRate.findAll()).length).toBe(2);
        // Match the 1st record.
        expect(resolvedRates[0]).toMatchObject({
            name: '24k_sovereign',
            price: response.data.rates['24k_sovereign'].toString(),
            date: response.data.date,
            notes: response.data.note,
            extraParams: {
                description: response.data.description,
            },
        });
        // Match the 2nd record.
        expect(resolvedRates[1]).toMatchObject({
            name: '22k_sovereign',
            price: response.data.rates['22k_sovereign'].toString(),
            date: response.data.date,
            notes: response.data.note,
            extraParams: {
                description: response.data.description,
            },
        });
    });

    test('should try 3 times to fetch the rates if the API request fails', async () => {
        // Mock the axios GET request to return error.
        jest.spyOn(axios, 'get').mockRejectedValue(new Error('404'));

        await ratesFetcher.fetchRates();

        // Assertions
        // API endpoint was called 3 times.
        expect(axios.get).toHaveBeenCalledTimes(3);
        // setTimeout function was called 2 times.
        expect(setTimeout).toHaveBeenCalledTimes(2);
        // setTimeout function was called with 60,000 milliseconds (1 minute) for the 2nd try.
        expect(setTimeout).toHaveBeenNthCalledWith(1, 60000);
        // setTimeout function was called with 300,000 milliseconds (5 minutes) for the 3rd try.
        expect(setTimeout).toHaveBeenNthCalledWith(2, 300000);
    });
});
