import { winstonLogger } from "@ductan2/sw-shared/src"
import { Logger } from "winston"
import { config } from "@gig/configs";
import mongoose from "mongoose";
const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'sw-gig-service', 'debug');
export const databaseConnetion = async () => {
    try {
        await mongoose.connect(`${config.DATABASE_URL}`)
        log.info('Connection mongo db has been established successfully.');
    } catch (error) {
        log.log('error', "sw-gig-service database.ts:21 ~ databaseConnection ~ error:", error)
    }
}