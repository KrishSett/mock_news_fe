/* eslint-disable prettier/prettier */
import axios from "axios";
import LoaderStorage from "../store/loader.storage";

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
  setHeaders(headers) {
      if (headers && typeof headers === 'object' && !Array.isArray(headers)) {
          if (Object.keys(headers).length === 0) {
              return;
          }
      } else {
          throw new TypeError('Headers must be a non-null, non-array object');
      }

      for (const [key, value] of Object.entries(headers)) {
          if (typeof key === 'string' && typeof value === 'string') {
              this.api.defaults.headers.common[key] = value;
          } else {
              console.warn(`Skipping invalid header: ${key} (must be string:string pairs)`);
          }
      }
  }

  // GET request with optional per-request headers
  async get(endpoint, params = {}, headers = {}) {
    try {
      LoaderStorage.show();
      const response = await this.api.get(endpoint, {
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    } finally {
      LoaderStorage.hide();
    }
  }

  // POST request with optional per-request headers
  async post(endpoint, data = {}, headers = {}) {
    try {
      LoaderStorage.show();
      const response = await this.api.post(endpoint, data, { headers });
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error?.message);
      throw error;
    } finally {
      LoaderStorage.hide();
    }
  }
}

export default ApiService;
