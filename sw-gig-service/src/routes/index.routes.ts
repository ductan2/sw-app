import { Application } from "express";
import { buyerRoutes } from "@gig/routes/buyer.routes";
import { sellerRoutes } from "@gig/routes/seller.routes";

const BASE_URL = '/api/v1'
export const appRoutes = (_app: Application) => {
    _app.use(`${BASE_URL}/buyer`, buyerRoutes.routes())
    _app.use(`${BASE_URL}/seller`, sellerRoutes.routes())
}