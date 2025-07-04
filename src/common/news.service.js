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
}

export const newsService = new NewsService();