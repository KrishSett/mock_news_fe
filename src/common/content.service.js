import ApiService from "./api.service";
import { API_ROUTES } from "../utils/route.list";

class ContentService extends ApiService {
  constructor() {
    super();
  }

  // Navbar API call
  async getNavbarItems(headers = {}) {
      try {
        const endpoint = API_ROUTES.NAVBAR;
        this.preValidateRequestedData(endpoint, headers)
        this.setHeaders(headers);
        const response = await this.get(endpoint);
        return response;
      } catch (error) {
          console.error('[NavbarService] Failed to fetch navbar items:', error);
          throw error;
      }
  }

  // Footer API call
  async getFooterPages(headers = {}) {
    try {
      const endpoint = API_ROUTES.FOOTER;
      this.preValidateRequestedData(endpoint, headers)
      this.setHeaders(headers);
      const response = await this.get(endpoint);
      return response;
    } catch (error) {
      console.error("[getFooterPages] Error", error);
      throw error;
    }
  }
}

// Singleton instance
export const contentService = new ContentService();