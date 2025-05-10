import FingerprintJS from "@fingerprintjs/fingerprintjs";
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
        timestamp: timestamp,
      };

      // JSON stringify the payload
      const jsonPayload = JSON.stringify(payload);

      // Base64 encode the string
      const combinedString = btoa(jsonPayload) + ";" + this.secretKey;
      return btoa(combinedString);
    } catch (error) {
      console.error("Encryption failed:", error);
      throw new Error("Failed to generate auth payload");
    }
  }

  async authenticate() {
    const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 day
    const STORAGE_KEY = "X-AUTH-TOKEN";
    const TIME_KEY = "X-AUTH-TIMESTAMP";

    try {
      let authToken = window.localStorage.getItem(STORAGE_KEY);
      let authTime = window.localStorage.getItem(TIME_KEY);
      const currentTime = Date.now();
      const tokenAge = currentTime - parseInt(authTime || 0);

      // Validate existing token
      if (!authToken || !authTime || tokenAge > TOKEN_EXPIRY_MS) {
        const authHash = this.generateEncryptedPayload();
        const response = await this.post(
          "/auth/login",
          {
            token: authHash,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

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
      console.error("Authentication failed:", error?.message);
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(TIME_KEY);
      throw error;
    }
  }

  encryptAuthToken(token, time) {
    try {
      const payload = {
        token: token,
        time: time,
      };

      return btoa(JSON.stringify(payload));
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  }

  decryptAuthToken(hashToken) {
    try {
      const authData = atob(hashToken);
      const jsonData = JSON.parse(authData);
      return jsonData.token;
    } catch (error) {
      console.error("Decryption error:", error);
      throw error;
    }
  }

  async userFingerPrint() {
    try {
      const HASH_KEY = "X-USER-ID";
      const fingerPrint = window.localStorage.getItem(HASH_KEY);

      if (fingerPrint) {
        return fingerPrint;
      }

      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();

      window.localStorage.setItem(HASH_KEY, visitorId);
      return visitorId;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getHashToken(authorization) {
    try {
      const USER_TOKEN_KEY = "X-AUTH-TYPE";
      let hashToken = window.localStorage.getItem(USER_TOKEN_KEY);
      if (!hashToken || !(await this.isTokenValid(hashToken))) {
        const visitorId = await this.userFingerPrint();
        hashToken = await this.post(
          "guest/hash",
          {
            visitorId: visitorId,
          },
          {
            authorization: `Bearer ${authorization}`,
          }
        );

        window.localStorage.setItem(USER_TOKEN_KEY, hashToken?._tkn);
        return hashToken;
      }

      return hashToken;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  isTokenValid(encodedToken) {
    try {
      const decodedToken = atob(encodedToken);
      const parts = decodedToken.split(";");
      if (parts.length !== 2) return false;

      const jsonData = atob(parts[0]);
      const data = JSON.parse(jsonData);

      return Number(data?.time) > Date.now();
    } catch {
      console.error("Token expired");
      return false;
    }
  }
}

export default AuthService;
