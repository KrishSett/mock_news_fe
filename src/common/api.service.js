import axios from "axios";

class ApiService {
  baseURL = process.env.VUE_APP_API_URL;

  constructor(defaultHeaders = {}) {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...defaultHeaders,
      },
    });
  }

  // Set or update headers globally
  setHeader(key, value) {
    this.api.defaults.headers.common[key] = value;
  }

  // GET request with optional per-request headers
  async get(endpoint, params = {}, headers = {}) {
    try {
      const response = await this.api.get(endpoint, {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  // POST request with optional per-request headers
  async post(endpoint, data = {}, headers = {}) {
    try {
      const response = await this.api.post(endpoint, data, { headers });
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error?.message);
      throw error;
    }
  }
}
const getUserIdFromStorage = () => {
  try {
    return window.localStorage.getItem("X-USER-ID") || null;
  } catch (error) {
    console.warn("LocalStorage access failed:", error);
    return null;
  }
};

const getAuthTypeFromStorage = () => {
  try {
    return window.localStorage.getItem("X-AUTH-TYPE") || null;
  } catch (error) {
    console.warn("LocalStorage access failed:", error);
    return null;
  }
};

export { getAuthTypeFromStorage, getUserIdFromStorage };

export default ApiService;
