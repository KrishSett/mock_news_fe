import ApiService from "./api.service";
import { API_ROUTES } from "../utils/route.list";

class NewsService extends ApiService {
    constructor() {
        super();
    }

    async getNewsDetails(uuid, headers = {}) {
        try {
            if (!uuid || typeof uuid !== 'string' || !uuid.trim()) {
                throw new Error('UUID is not present or invalid');
            }

            const endpoint = `${API_ROUTES.NEWS_DETAILS}/${uuid}`;
            this.preValidateRequestedData(endpoint, headers);
            this.setHeaders(headers);

            return await this.get(endpoint);
        } catch (error) {
            console.error('[getNewsDetails] Failed to fetch news details:', error);
            throw error;
        }
    }

    async getSubcategoryNewsList (slug, headers = {}, page = 1) {
        try {
            if (!slug || typeof slug !== 'string' || !slug.trim()) {
                throw new Error('Slug is not present or invalid');
            }

            const endpoint = `${API_ROUTES.SUBCATEGORY_NEWS_LIST}/${slug}?page=${page}`;
            this.preValidateRequestedData(endpoint, headers);
            this.setHeaders(headers);

            return await this.get(endpoint);
        } catch (error) {
            console.error('[getSubcategoryNewsList] Failed to fetch news details:', error);
            throw error;
        }
    }

    async getTagNewsList(tags, headers = {}, page = 1) {
        try {
console.log('page', page);
            if (!tags.length || !Array.isArray(tags)) {
                throw new Error('Tags are not present or invalid');
            }

            const endpoint = `${API_ROUTES.TAG_NEWS_LIST}?page=${Number(page)}`;
            const payload = {
                tags: tags
            };
            this.preValidateRequestedData(endpoint, headers);
            this.setHeaders(headers);

            return await this.post(endpoint, payload, headers);
        } catch (error) {
            console.error('[getTagNewsList] Failed to fetch news details:', error);
            throw error;
        }
    }
}

export const newsService = new NewsService();