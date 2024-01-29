import { elasticsearch } from "@gig/utils/elasticsearch";

class GigService{
    public async getGigById(gigId: string) {
        const gigs = await elasticsearch.getDocumentById('gigs', gigId);
        return gigs;
    }
    public async searchGigs(query: string) {
        console.log("🚀 ~ SearchService ~ searchGigs ~ query:", query)
        
    }
}
export const gigService = new GigService();