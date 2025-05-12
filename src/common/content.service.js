import ApiService from "./api.service";
import { API_ROUTES } from "../utils/route.list";

class ContentService extends ApiService {
  constructor() {
    super();
  }

  // Navbar API call
  async getNavbarItems(headers = {}) {
      try {
          if (typeof headers !== 'object' || headers === null || Array.isArray(headers)) {
              throw new Error('Headers must be a non-null, non-array object');
          }

          if (typeof API_ROUTES.NAVBAR !== 'string' || !API_ROUTES.NAVBAR.trim()) {
              throw new Error('Invalid NAVBAR route configuration');
          }

          this.setHeaders(headers);
          const response = await this.get(API_ROUTES.NAVBAR);
          return response;
      } catch (error) {
          console.error('[NavbarService] Failed to fetch navbar items:', error);
          throw error;
      }
  }

  // Footer API call
  async getFooterContent() {
    try {
      const endpoint = this.getEndPoint("footer");
      return this.get(endpoint);
    } catch (error) {
      console.log("[getFooterContent] Error", error);
      return null;
    }
  }
}

// Singleton instance
export const contentService = new ContentService();