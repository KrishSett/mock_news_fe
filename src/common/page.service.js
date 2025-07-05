import ApiService from "./api.service"
import { API_ROUTES } from "../utils/route.list";

class PageService extends ApiService {
    constructor() {
        super();
    }

    async getPageDetails(slug, headers = {}) {
        try {
            if (!slug || typeof slug !== 'string' || !slug.trim()) {
                throw new Error('UUID is not present or invalid');
            }

            const endpoint = `${API_ROUTES.PAGE_DETAILS}/${slug}`;
            this.preValidateRequestedData(endpoint, headers);
            this.setHeaders(headers);

            return await this.get(endpoint);
        } catch (error) {
            console.error('[getPageDetails] Failed to fetch news details:', error);
            throw error;
        }
    }

}

export const pageService = new PageService();