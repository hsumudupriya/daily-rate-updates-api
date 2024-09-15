## About

This Node.js application is developed by [Hasanta Sumudupriya](https://www.linkedin.com/in/hsumudupriya) as a technical task for Ceylon Cash. The objectives of the application are as below.

1. Fetch daily rates of goods (f.e. Gold, Crypto P2P, commodities) from 3rd party APIs via a cron job and store them in a PostgreSQL database.
1. Provide an API endpoint to fetch the rates of a particular date.

## System requirements

This application utilizes Node.js JavaScript runtime environment (v20.17.0 or later) to run. Download and install Node.js using this [link](https://nodejs.org/en/download/package-manager/current).

## Run the application.

Open bash/terminal/command line tool and run the commands below to start the application.

1. `git clone git@github.com:hsumudupriya/daily-rate-updates-api.git`
1. `cd daily-rate-updates-api`
1. `cp .env.example .env`
1. Set values of the below variables in the `.env` file.
    1. `DB_USERNAME`
    1. `DB_PASSWORD`
    1. `DB_DATABASE`
    1. `DB_HOST`
    1. `DB_PORT`
1. `npm install`
1. `npm run db:create` to create the database if you have not created it already.
1. `npm run db:migrate`
1. `npm run build`
1. Add the below entry to your crontab to fetch rates at 00:01 every day.
    - `1 0 * * *  cd /path/to/daily-rate-updates-api && node dist/cron/fetchRates.cron.js`
1. `npm run start`

Untill the cron job runs, you might not have data to test the application. Because of that you can fetch the rates manually by running the command `node dist/cron/fetchRates.cron.js` in another bash/terminal/command line tool.

Open the browser and visit [localhost:3000/api/rates?date=2024-09-14](http://localhost:3000/api/rates?date=2024-09-14) to view the rates for the date 2024-09-14. You can change the date to today if you receive and empty result.

<!-- ## Run the tests

Run `docker-compose exec laravel php artisan test` command in another bash/terminal/command line tool to test the application yourself.

The below tests are implemented in the application.

![tests](/test-results.jpg 'tests') -->

## Additional info

### Folder structure of the application

```
├── dist
│   ├── cron
│   |   |── fetchRates.cron.js
│   └── index.js
├── node_modules
├── src
│   ├── controllers
│   ├── cron
│   ├── database
│   |   |── migrations
│   |   |── models
│   |   |── seeders
│   ├── interfaces
│   |   |── CommodityRate.dto.ts
│   |   |── FetchingError.dto.ts
│   |   |── GetCommodityRatesParams.dto.ts
│   |   |── RateFetcher.interface.ts
│   ├── rate_fetchers
│   |   |── gold_rates
|   |   |   |── interfaces
|   |   |   |   |── GoldRatesExtraParams.dto.ts
|   |   |   |   |── GoldRatesResponse.dto.ts
|   |   |   |── GoldRatesFetcher.ts
│   |   |── p2p_rates
|   |   |   |── interfaces
│   |   |── welandapola_rates
|   |   |   |── interfaces
│   ├── routes
│   ├── services
│   |   |── RatesFetcher.service.ts
│   └── index.ts
└── .env
```

### Intergrated APIs

1. `https://ceyloncash.com/api/goldrates` - To fetch Gold rates.
1. `https://nisal.me/p2p/post.php` - To fetch Cryptocurrency P2P rates.
1. `https://api.welandapola.com/api/prices` - To fetch commodity rates.

### How to intergrate a new API to fetch rates

A module to intergrate a new API to fetch rates should contain two interfaces and a class as below.

1. An interface that defines the parameters of the response of the API endpoint.

    ![Response.dto.ts](assets/Response.dto.ts.jpg 'Response.dto.ts')

1. An interface that defines which parameters of the response should be stored as extra parameters.

    ![ExtraParams.dto.ts](assets/ExtraParams.dto.ts.jpg 'ExtraParams.dto.ts')

1. A class which implements the `src/interfaces/RateFetcher.interface`.

    1. It should contain a `url` property that defines the URL address of the API endpoint.
    1. It should define a `get()` method that will return a promise of `Promise<Array<CommodityRate>`.

        ![Fetcher.ts](assets/Fetcher.ts.jpg 'Fetcher.ts')

Add an instance of the class to the `rateFetchers` property inside the constructor of the `src\services\RatesFetcher.service.ts` class to consume the API.

![RatesFetcher.service.ts](assets/RatesFetcher.service.ts.jpg 'RatesFetcher.service.ts')

All the modules for fetching rates should be in the `src/rate-fetchers` folder. You can copy an existing folder like `gold-rates` and edit it to implement a new API.

### More info about the cron to fetch the rates

If an eror occurs while fetching rates from any given API on the 1st try, the application will try again after 1 minute. If the 2nd try also fails, a 3rd try will be made after 5 minutes. Only 3 tries will be made for an API.

![exponential-retry](assets/exponential-retry.jpg 'exponential-retry')

### Data validations

Data validations are implemented using Sequelize validations in models.

![model-validations](assets/model-validations.jpg 'model-validations')

### ER diagram of the application

![erd](assets/erd.jpg 'erd')
