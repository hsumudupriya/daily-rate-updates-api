require('ts-node/register');
// const configs = require('../configs.ts');

// TODO: Update with env vars.
// module.exports = {
//     username: configs.DB_USERNAME ?? 'postgres',
//     password: configs.DB_PASSWORD ?? 'postgres',
//     database: configs.DB_DATABASE ?? 'daily_rates_api',
//     host: configs.DB_HOST ?? '127.0.0.1',
//     dialect: configs.DB_DIALECT ?? 'postgres',
//     port: configs.DB_PORT ?? 3306,
// };

module.exports = {
    username: 'postgres',
    password: 'postgres',
    database: 'daily_rates_api',
    host: '127.0.0.1',
    dialect: 'postgres',
    port: 5432,
};
