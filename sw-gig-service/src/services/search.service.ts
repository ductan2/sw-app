import { IHitsTotal, IQueryList, ISellerGig } from "@ductan2/sw-shared/src";
import { GigModel } from "@gig/models/gig.model";
import { publishDirecMessage } from "@gig/queues/user.product";
import { gigsChannel } from "@gig/server";
import { elasticsearch } from "@gig/utils/elasticsearch";
import { Channel } from "amqplib";
import { gigService } from "./gig.service";

class SearchService {
    public async gigsSearch(searchQuery: string, active: boolean) {
        const queryList: IQueryList[] = [
            {
                query_string: {
                    fields: ["sellerId"],
                    query: `*${searchQuery}*`

                }
            },
            {
                term: {
                    active
                }
            }
        ]

        const result = await elasticsearch.client.search({
            index: 'gigs',
            query: {
                bool: {
                    must: [...queryList]
                }
            },
        })
        const total = result.hits.total as IHitsTotal;
        return {
            total: total.value,
            hits: result.hits.hits
        }

    }
    public async createGigDocument(gigData: ISellerGig) {
        const gig = await GigModel.create(gigData);
        if (gig) {
            await publishDirecMessage({
                channel: gigsChannel as Channel,
                exchangeName: 'sw-seller-update',
                routingKey: "user-seller",
                logMessage: "Details send for users service",
                message: JSON.stringify({
                    type: "update-gig-count",
                    gigSellerId: gig.sellerId,
                    gigCount: 1
                })
            })
            await elasticsearch.addDataToIndex('gig', gig.id, gig.toJSON());
        }
        return gig;
    }
}
export const searchService = new SearchService();