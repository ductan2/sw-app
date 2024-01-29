import { getBuyerByCurrentUsernameController, getBuyerByCurrentEmailController, getBuyerByUsernameController, } from "@gig/controller/buyer.controller";
import express, { Router } from "express";
class BuyerRoutes {
    private router: Router;
    constructor() {
        this.router = express.Router();
    }
    public routes() { 
        this.router.get('/email', getBuyerByCurrentEmailController)
        this.router.get('/username', getBuyerByCurrentUsernameController)
        this.router.get('/:username', getBuyerByUsernameController  )
        return this.router;
    }
}

export const buyerRoutes = new BuyerRoutes();