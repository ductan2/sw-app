import express from "express";
import { GigsServer } from "@gig/server";
import { config } from "@gig/configs";
import { databaseConnetion } from "@gig/database";


class Application {
    public initialize() {
        config.cloudinaryConfig();
        const app = express();
        const server = new GigsServer(app);
        databaseConnetion();
        server.start();
    }
}
const application = new Application();
application.initialize();