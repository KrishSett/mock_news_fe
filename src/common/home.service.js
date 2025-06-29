import ApiService from "./api.service";
import { API_ROUTES } from "../utils/route.list";

class HomeService extends ApiService {
    constructor () {
        super();
    }

    async getHomePageContents(headers = {}) {
        try {
            const endpoint = API_ROUTES.HOME;
            this.preValidateRequestedData(endpoint, headers)
            this.setHeaders(headers);
            const response = await this.get(endpoint);
            return response;
        } catch (error) {
            console.error('[getHomePageContents] Failed to fetch home page contents:', error);
            throw error;
        }
    }
}

export const homeService = new HomeService();