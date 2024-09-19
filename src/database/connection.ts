import 'dotenv/config';
import { Options, Sequelize } from 'sequelize';

const options: Options = {
    host: process.env.DB_HOST!,
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT!),
};

if (process.env.APP_ENV === 'test' || process.env.APP_ENV === 'prod') {
    // options.logging = false;
}

let sequelize: Sequelize = new Sequelize(
    process.env.DB_DATABASE!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD!,
    options
);

export default sequelize;
