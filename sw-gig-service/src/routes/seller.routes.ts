
import { seedSellerController } from "@gig/controller/seed.controller";
import { createSellerController, getRandomSellerController, getSellerByEmailController, getSellerByIdController, getSellerByUsernameController, updateSellerController } from "@gig/controller/seller.controller";
import express, { Router } from "express";
class SellerRoutes {
    private router: Router;
    constructor() {
        this.router = express.Router();
    }
    public routes() {
        this.router.get('/email', getSellerByEmailController)
        this.router.get('/username/:username', getSellerByUsernameController)
        this.router.get("/random/:count", getRandomSellerController)
        this.router.get('/:sellerId', getSellerByIdController)
        this.router.post("/", createSellerController)
        this.router.post('/seed/:count', seedSellerController)
        this.router.patch("/:sellerId", updateSellerController)
        return this.router;
    }
}

export const sellerRoutes = new SellerRoutes();