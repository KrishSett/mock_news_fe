import ApiService from "./api.service";
import { API_ROUTES } from "../utils/route.list";
import { useNavStore } from "../states/nav.states";
import { useFooterStore } from "../states/footer.states";

class ContentService extends ApiService {
  constructor() {
    super();
  }

  // Navbar API call
  async getNavbarItems(headers = {}) {
    const navStore = useNavStore();
    const navItems = navStore.getNavItems;
    if (navItems && !navStore.isNavExpired) {
      return navItems;
    }

    try {
      const endpoint = API_ROUTES.NAVBAR;
      this.preValidateRequestedData(endpoint, headers)
      this.setHeaders(headers);
      const response = await this.get(endpoint);

      // Store in pinia 
      navStore.setNavItems(response);
      return response;
    } catch (error) {
        console.error('[NavbarService] Failed to fetch navbar items:', error);
        throw error;
    }
  }

  // Footer API call
  async getFooterPages(headers = {}) {
    const footerStore = useFooterStore();
    const footerPages = footerStore.getFooterPages;
    if (footerPages && !footerStore.isFooterExpired) {
      return footerPages;
    }

    try {
      const endpoint = API_ROUTES.FOOTER;
      this.preValidateRequestedData(endpoint, headers)
      this.setHeaders(headers);
      const response = await this.get(endpoint);
      footerStore.setFooterPages(response);
      return response;
    } catch (error) {
      console.error("[getFooterPages] Error", error);
      throw error;
    }
  }
}

// Singleton instance
export const contentService = new ContentService();