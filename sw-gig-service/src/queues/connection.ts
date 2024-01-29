import client, { Channel, Connection } from "amqplib";
import { config } from "@gig/configs";
import { winstonLogger } from "@ductan2/sw-shared/src";

const log = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'sw-gig-service', 'debug');
class RabbitMQ {
    private channel: Channel | null = null;
    private connection: Connection | null = null;

    public async connect() {
        try {
            this.connection = await client.connect(config.RABBITMQ_ENDPOINT as string);
            this.channel = await this.connection.createChannel();
            log.info("User server connected to rabbitmq");
            this.closeConnection();
            return this.channel;
        } catch (error) {
            log.error("sw-gig-service connection.ts:57 ~ createConnenction ~ error", error);
        }
    }

    private closeConnection() {
        process.once("SIGINT", async () => {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
        });
    }
}

export const rabbitMQ = new RabbitMQ();
