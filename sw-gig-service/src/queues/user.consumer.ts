// import { config } from "@gig/configs";
// import { winstonLogger } from "@ductan2/sw-shared/src";
// import { Channel, ConsumeMessage } from "amqplib";
// import { rabbitMQ } from "./connection";
// import { buyerService } from "@gig/services/buyer.service";
// import { sellerService } from "@gig/services/seller.service";
// import { publishDirecMessage } from "./user.product";


// const log = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'sw-user-service', 'debug');
// export const consumerBuyerDirecMessage = async (channel: Channel) => {
//     try {
//         if (!channel) {
//             channel = await rabbitMQ.connect() as Channel;
//         }
//         const exChangeName = 'sw-buyer-update';
//         const routingKey = 'user-buyer';
//         const queueName = 'user-buyer-queue';
//         channel.assertExchange(exChangeName, 'direct');
//         const swQueue = await channel.assertQueue(queueName, {
//             durable: true, autoDelete: false
//         }); // check exits queue
//         await channel.bindQueue(swQueue.queue, exChangeName, routingKey); // bind queue 
//         channel.consume(swQueue.queue, async (msg: ConsumeMessage | null) => {
//             const { type } = JSON.parse(msg?.content.toString() as string);
//             if (type === 'auth') {
//                 const { username, email, profilePicture, country } = JSON.parse(msg?.content.toString() as string);
//                 await buyerService.createBuyer({
//                     username, email, profilePicture, country, purchasedGigs: []
//                 })
//             }
//             else {
//                 const { buyerId, purchasedGigs } = JSON.parse(msg?.content.toString() as string);
//                 await buyerService.updateBuyerPurchasedGigs(buyerId, purchasedGigs, type);
//             }
//         })
//     } catch (error) {
//         log.log('error', `sw-user-service auth.consumer.ts ~ consumerMessage()~ error `, error)
//     }
// }
// export const consumerSellerDirecMessage = async (channel: Channel) => {
//     try {
//         if (!channel) {
//             channel = await rabbitMQ.connect() as Channel;
//         }
//         const exChangeName = 'sw-seller-update';
//         const routingKey = 'user-seller';
//         const queueName = 'user-seller-queue';
//         channel.assertExchange(exChangeName, 'direct');
//         const swQueue = await channel.assertQueue(queueName, {
//             durable: true, autoDelete: false
//         }); // check exits queue
//         await channel.bindQueue(swQueue.queue, exChangeName, routingKey); // bind queue 
//         channel.consume(swQueue.queue, async (msg: ConsumeMessage | null) => {
//             const { type, sellerId, ongoingJobs, completedJobs, recentDelivery, gigSellerId, count } = JSON.parse(msg?.content.toString() as string);
//             if (type === 'create-order') {
//                 // when buyer create order, update ongoing jobs
//                 await sellerService.updateSellerOnGoingJobs(sellerId, ongoingJobs);
//             }
//             else if (type === 'approve-order') {
//                 // when seller approve order, update completed jobs and ongoing jobs
//                 await sellerService.updateSellerCompletedJobs({
//                     completedJobs,
//                     sellerId,
//                     ongoingJobs,
//                     totalEarnings: 0,
//                     recentDelivery
//                 })
//             }
//             else if (type === 'update-gig-count') {
//                 // when seller create gig, update total gigs
//                 await sellerService.updateSellerGigsCount(gigSellerId, count);
//             }
//             else if (type === 'cancel-order') {
//                 // when seller cancel order, update ongoing jobs
//                 await sellerService.updateSellerOnGoingJobs(sellerId, -1);
//             }
//             channel.ack(msg as ConsumeMessage);
//         })
//     } catch (error) {
//         log.log('error', `sw-user-service auth.consumer.ts ~ consumerMessage()~ error `, error)
//     }
// }

// export const consumerReviewerDirecMessage = async (channel: Channel) => {
//     try {
//         if (!channel) {
//             channel = await rabbitMQ.connect() as Channel;
//         }
//         const exChangeName = 'sw-review';
//         const queueName = 'seller-review-queue';
//         channel.assertExchange(exChangeName, 'direct');
//         const swQueue = await channel.assertQueue(queueName, {
//             durable: true, autoDelete: false
//         }); // check exits queue
//         await channel.bindQueue(swQueue.queue, exChangeName, ''); // bind queue 

//         channel.consume(swQueue.queue, async (msg: ConsumeMessage | null) => {
//             const { type } = JSON.parse(msg?.content.toString() as string);
//             if (type === 'buyer-review') {
//                 await sellerService.updateSellerReviews(JSON.parse(msg?.content.toString() as string));
//             }
//             await publishDirecMessage({
//                 channel,
//                 exchangeName: 'sw-update-gig',
//                 routingKey: 'update-gig',
//                 message: JSON.stringify({ type: 'updateGig', gigReview: JSON.parse(msg?.content.toString() as string) }),
//                 logMessage: 'send message to gig service'
//             })
//             channel.ack(msg!)
//         })
//     } catch (error) {
//         log.log('error', `sw-user-service auth.consumer.ts ~ consumerMessage()~ error `, error)
//     }
// }
// export const consumerSeedGigrDirecMessage = async (channel: Channel) => {
//     try {
//         if (!channel) {
//             channel = await rabbitMQ.connect() as Channel;
//         }
//         const exChangeName = 'sw-gig';
//         const routingKey = 'get-sellers';
//         const queueName = 'user-gig-queue';
//         channel.assertExchange(exChangeName, 'direct');
//         const swQueue = await channel.assertQueue(queueName, {
//             durable: true, autoDelete: false
//         }); // check exits queue
//         await channel.bindQueue(swQueue.queue, exChangeName, routingKey); // bind queue 

//         channel.consume(swQueue.queue, async (msg: ConsumeMessage | null) => {
//             const { type } = JSON.parse(msg?.content.toString() as string);
//             if (type === 'buyer-review') {
//                 const { count } = JSON.parse(msg?.content.toString() as string);
//                 const sellers = await sellerService.getRandomSellers(parseInt(count || 10));
//                 await publishDirecMessage({
//                     channel,
//                     exchangeName: 'sw-seed-gig',
//                     routingKey: 'receive-sellers',
//                     message: JSON.stringify({ type: 'receiveSellers', sellers, count }),
//                     logMessage: 'send message to gig service'
//                 })
//             }
//             channel.ack(msg!);
//         })
//     } catch (error) {
//         log.log('error', `sw-user-service auth.consumer.ts ~ consumerMessage()~ error `, error)
//     }
// }
