import CommodityRate from '../database/models/commodityrate';
import GetCommodityRatesParams from '../interfaces/GetCommodityRatesParams.dto';

export default class CommodityRatesController {
    static index(filters: GetCommodityRatesParams): Promise<CommodityRate[]> {
        return CommodityRate.findAll({
            where: {
                date: filters.date,
            },
        });
    }
}
