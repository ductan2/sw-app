import { config } from "@gig/configs";
import { Logger } from "winston";
import { winstonLogger } from "@ductan2/sw-shared/src";
import { Client } from "@elastic/elasticsearch";
const log: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'sw-gigs-service', 'debug');
class Elasticsearch {
    public client: Client;
    constructor() {
        this.client = new Client({
            node: `${config.ELASTICSEARCH_URL}`
        });
    }

    public async checkConnectElasticSearch() {
        let isConnected = false;
        log.log('info', `${config.ELASTICSEARCH_URL}`)
        while (!isConnected) {
            try {
                const health = await this.client.cluster.health({});
                log.info(`Gigs ElasticSearch health status - ${health.status}`);
                isConnected = true;
            } catch (error) {
                log.log('error', "sw-gigs-service elasticsearch.ts:50 ~ startElasticSearch ~ error:", error)
                log.error("Connection to elasticsearch failed, retrying...")
            }
        }
    }
    public async checkExistIndex(index: string): Promise<boolean> {
        const indexExist = await this.client.indices.exists({ index }); // check index exist
        return indexExist;
    }
    public async createIndex(index: string) {
        try {
            const result = await this.checkExistIndex(index);
            if (result) {
                log.info(`Index ${index} is exist`);
                return;
            }
            else {
                await this.client.indices.create({ index });
                await this.client.indices.refresh({ index });
                log.info(`Index ${index} is created`);
            }
        } catch (error) {
            log.log('error', "sw-gigs-service elasticsearch.ts:50 ~ create elasticsearch ~ error:", error)
            log.error("Create to elasticsearch failed, retrying...")
        }
    }
    public async getDocumentById(index: string, id: string) {
        try {
            const result = await this.client.get({
                index, id
            })
            return result._source;
        } catch (error) {
            log.log('error', "sw-gigs-service getDocumentById() ~ create elasticsearch ~ error:", error)
            return {}
        }
    }
    public async addDataToIndex(index: string, id: string, body: any) {
        try {
            await this.client.index({
                index,
                id,
                document: body
            })
        } catch (error) {
            log.log('error', "sw-gigs-service addDataToIndex() ~ create elasticsearch ~ error:", error)
        }
    }
    public async updateDataToIndex(index: string, id: string, body: any) {
        try {
            await this.client.update({
                index,
                id,
                doc: body
            })
        } catch (error) {
            log.log('error', "sw-gigs-service updateDataToIndex() ~ create elasticsearch ~ error:", error)
        }
    }
    public async deleteDataToIndex(index: string, id: string) {
        try {
            await this.client.delete({
                index,
                id
            })
        } catch (error) {
            log.log('error', "sw-gigs-service deleteDataToIndex() ~ create elasticsearch ~ error:", error)
        }
    }
}

// Sử dụng lớp ElasticsearchService
export const elasticsearch = new Elasticsearch();