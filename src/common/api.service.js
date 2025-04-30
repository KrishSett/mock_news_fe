import axios from 'axios';

class ApiService {
    constructor(baseURL, defaultHeaders = {}) {
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...defaultHeaders // Default custom headers (optional)
            }
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
                headers
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
            console.error(`POST ${endpoint} failed:`, error);
            throw error;
        }
    }
}

export default ApiService;
