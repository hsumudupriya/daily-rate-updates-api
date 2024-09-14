import { Request, Response, Router } from 'express';
import GetCommodityRatesParams from '../interfaces/GetCommodityRatesParams.dto';
import CommodityRatesController from '../controllers/commodityrates.controller';

const ratesRouter = Router();

ratesRouter.get(
    '/api/rates',
    async (
        request: Request<{}, {}, {}, GetCommodityRatesParams>,
        response: Response
    ) => {
        try {
            // TODO: Log the request.
            console.log(request.ip);

            let rates = await CommodityRatesController.index({
                date: request.query.date,
            });

            return response.status(200).json(rates);
        } catch (error) {
            return response.status(500).send(error);
        }
    }
);

export default ratesRouter;
