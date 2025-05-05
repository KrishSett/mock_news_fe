import ApiService from "./api.service";

class AuthService extends ApiService {
    constructor() {
        super();
        this.email = process.env.VUE_APP_AUTH_EMAIL;
        this.password = process.env.VUE_APP_AUTH_PASSWORD;
        this.secretKey = process.env.VUE_APP_SECRET_KEY;

        if (!this.secretKey) {
            throw new Error("Encryption secret key is missing");
        }
    }

    generateEncryptedPayload() {
        try {
            const timestamp = Date.now();
            const payload = {
                email: this.email,
                password: this.password,
                timestamp: timestamp
            };

            // JSON stringify the payload
            const jsonPayload = JSON.stringify(payload);

            // Base64 encode the string
            const combinedString = btoa(jsonPayload) + ';' + this.secretKey;
            return btoa(combinedString);
        } catch (error) {
            console.error("Encryption failed:", error);
            throw new Error("Failed to generate auth payload");
        }
    }

    async authenticate() {
        const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 day
        const STORAGE_KEY = 'X-AUTH-TOKEN';
        const TIME_KEY = 'X-AUTH-TIMESTAMP';

        try {
            let authToken = window.localStorage.getItem(STORAGE_KEY);
            let authTime = window.localStorage.getItem(TIME_KEY);
            const currentTime = Date.now();
            const tokenAge = currentTime - parseInt(authTime || 0);

            // Validate existing token
            if (!authToken || !authTime || tokenAge > TOKEN_EXPIRY_MS) {
                const authHash = this.generateEncryptedPayload();
                const response = await this.post('/auth/login', {
                    token: authHash
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response?.success || !response.token || !response.time) {
                    throw new Error(`Invalid auth response - ${response.message}`);
                }

                // Store new token
                authToken = response.token;
                authTime = response.time;
                const encToken = this.encryptAuthToken(authToken, authTime);

                window.localStorage.setItem(STORAGE_KEY, encToken);
                window.localStorage.setItem(TIME_KEY, authTime);
            }

            return true;

        } catch (error) {
            console.error('Authentication failed:', error);
            window.localStorage.removeItem(STORAGE_KEY);
            window.localStorage.removeItem(TIME_KEY);
            return false;
        }
    }

    encryptAuthToken(token, time) {
        try {
            const payload = {
                token: token,
                time: time
            }

            return btoa(JSON.stringify(payload));
        } catch (error) {
            console.error('Encryption error:', error);
            throw error;
        }
    }

    decryptAuthToken(hashToken) {
        try {
            const authData = atob(hashToken);
            const jsonData = JSON.parse(authData);
            return jsonData.token;
        } catch (error) {
            console.error('Decryption error:', error);
            throw error;
        }
    }
}

export default AuthService;