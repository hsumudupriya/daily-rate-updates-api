import 'dotenv/config';
import { Sequelize } from 'sequelize';

let sequelize: Sequelize = new Sequelize(
    process.env.DB_DATABASE!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST!,
        dialect: 'postgres',
        port: parseInt(process.env.DB_PORT!),
    }
);

export default sequelize;
