import { Sequelize } from 'sequelize';
// import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USERNAME } from '../configs';

// TODO: Update with env vars
// let sequelizeConnection: Sequelize = new Sequelize(
//     DB_DATABASE,
//     DB_USERNAME,
//     DB_PASSWORD,
//     {
//         host: DB_HOST,
//         dialect: 'mysql',
//         port: 3306,
//     }
// );

// export default sequelizeConnection;

let sequelize: Sequelize = new Sequelize(
    'daily_rates_api',
    'postgres',
    'postgres',
    {
        host: '127.0.0.1',
        dialect: 'postgres',
        port: 5432,
    }
);

export default sequelize;
