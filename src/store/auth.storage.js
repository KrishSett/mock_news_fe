/* eslint-disable prettier/prettier */

class AuthStorage {
  static storageKeys = {
    "authToken": "X-AUTH-TOKEN",
    "authTime": "X-AUTH-TIMESTAMP",
    "userId": "X-USER-ID",
    "authType": "X-AUTH-TYPE",
  };

  // Get value from localStorage
  static #getValue(key) {
    try {
      return localStorage.getItem(key) || null;
    } catch (error) {
      console.warn(`Failed to read ${key}:`, error);
      return null;
    }
  }

  // Set value in localStorage
  static #setValue(key, value) {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`Failed to write ${key}:`, error);
    }
  }

  // Getters
  static get authToken() {
    return this.#getValue(this.storageKeys.authToken);
  }

  static get authTime() {
    return this.#getValue(this.storageKeys.authTime);
  }

  static get userId() {
    return this.#getValue(this.storageKeys.userId);
  }

  static get authType() {
    return this.#getValue(this.storageKeys.authType);
  }

  // Setters
  static set authToken(value) {
    this.#setValue(this.storageKeys.authToken, value);
  }

  static set authTime(value) {
    this.#setValue(this.storageKeys.authTime, value);
  }

  static set userId(value) {
    this.#setValue(this.storageKeys.userId, value);
  }

  static set authType(value) {
    this.#setValue(this.storageKeys.authType, value);
  }
}

export default AuthStorage;