/* eslint-disable prettier/prettier */
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import ApiService from "./api.service";
import { useAuthStore } from "../states/auth.states"; // Import Pinia store

class AuthService extends ApiService {
  constructor() {
    super();
    this.email = process.env.VUE_APP_AUTH_EMAIL;
    this.password = process.env.VUE_APP_AUTH_PASSWORD;
    this.secretKey = process.env.VUE_APP_SECRET_KEY;

    if (!this.secretKey) {
      throw new Error("Encryption secret key is missing");
    }

    this._authStore = null;
  }

  get authStore() {
    if (!this._authStore) {
      this._authStore = useAuthStore();
    }
    return this._authStore;
  }

  generateEncryptedPayload() {
    try {
      const timestamp = Date.now();
      const payload = {
        email: this.email,
        password: this.password,
        timestamp: timestamp,
      };

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
    const DEFAULT_EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 day (fallback)

    try {
      // Read from Pinia store instead of AuthStorage
      const storedTime = Number(this.authStore.authTime) || 0;
      const storedToken = this.authStore.authToken
        ? this.decryptAuthToken(this.authStore.authToken)
        : null;

      // Validate token freshness
      const isTokenValid =
        storedToken &&
        storedTime &&
        Date.now() - storedTime < DEFAULT_EXPIRY_MS;

      if (!isTokenValid) {
        const authHash = this.generateEncryptedPayload();
        const response = await this.post("/auth/login", {
          token: authHash,
        });

        if (!response?.token) {
          throw new Error("Missing token in auth response");
        }

        if (!response?.time) {
          throw new Error("Missing timestamp in auth response");
        }

        // Store in Pinia
        this.authStore.setAuthToken(
          this.encryptAuthToken(response.token, response.time),
          response.time
        );

        return response.token;
      }

      return storedToken;
    } catch (error) {
      console.error("Authentication failed:", error.message);
      // Clear via Pinia
      this.authStore.authToken = null;
      this.authStore.authTime = null;
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
      // Get from Pinia store
      const fingerPrint = this.authStore.visitorId;

      if (fingerPrint) {
        return fingerPrint;
      }

      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      // Store in Pinia
      this.authStore.setVisitorId(visitorId);

      return visitorId;
    } catch (error) {
      console.log("Error while retrieving browser data", error);
      throw error;
    }
  }

  async getHashToken(authorization) {
    try {
      const fpId = await this.userFingerPrint();
      // Get from Pinia
      const existingToken = this.authStore.authType;

      // Validate and check token
      if (existingToken && await this.isTokenValid(existingToken)) {
        return {
          authTypeValue: existingToken,
          fingerprint: fpId
        };
      }

      // Generate new token
      const response = await this.post(
        "guest/hash",
        {
          visitorId: fpId
        },
        {
          authorization: `Bearer ${authorization}`,
        }
      );

      if (!response?._tkn) {
        throw new Error('Invalid token response from server');
      }

      const authTypeValue = response._tkn;
      // Store in Pinia
      this.authStore.setAuthType(authTypeValue);

      return {
        authTypeValue: authTypeValue,
        fingerprint: fpId
      };

    } catch (error) {
      console.error('Failed to get hash token:', error);
      this.authStore.authType = null;
      throw new Error('Authentication failed. Please try again.');
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

export const authService = new AuthService();