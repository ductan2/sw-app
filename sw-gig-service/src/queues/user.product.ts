import { config } from "@gig/configs";
import { winstonLogger } from "@ductan2/sw-shared/src";
import { Channel } from "amqplib";
import { rabbitMQ } from "./connection";

const log = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'sw-user-service', 'debug');

export const publishDirecMessage = async ({ channel, exchangeName, routingKey, message, logMessage }: {
    channel: Channel, exchangeName: string, routingKey: string, message: string, logMessage: string
}) => {
    try {
        if (!channel) {
            channel = await rabbitMQ.connect() as Channel;
        }
        await channel.assertExchange(exchangeName, 'direct'); // check exits exchange
        channel.publish(exchangeName, routingKey, Buffer.from(message)); // send message
        log.info(logMessage)

    } catch (error) {
        log.log('error', `sw-user-service auth.producer.ts ~ publishMessage()~ error `, error)
    }
}
