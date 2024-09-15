import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from 'sequelize';
import sequelize from '../connection';

class CommodityRate extends Model<
    InferAttributes<CommodityRate>,
    InferCreationAttributes<CommodityRate>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare price: number;
    declare date: string;
    declare notes?: string | null;
    declare extraParams?: object | null;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

CommodityRate.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                isNumeric: true,
            },
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true,
            },
        },
        notes: DataTypes.TEXT,
        extraParams: DataTypes.JSON,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        sequelize,
        modelName: 'CommodityRate',
    }
);

export default CommodityRate;
