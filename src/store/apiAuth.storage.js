import { ref } from 'vue';
import { authService } from '../common/auth.service';

const isLoading = ref(false);
const authorization = ref(null);
const authType = ref(null);
const visitorId = ref(null);

export const useAuth = () => {
  const authenticate = async () => {
    try {
      isLoading.value = true;
      const authToken = await authService.authenticate();
      if (!authToken) {
        console.log("Auth failed");
        throw new Error("Auth failed");
      }

      const { authTypeValue, fingerprint } = await authService.getHashToken(authToken);
      if (!authTypeValue || !fingerprint) {
        console.log("Hash failed");
        throw new Error("Hash failed");
      }

      authorization.value = authToken;
      authType.value = authTypeValue;
      visitorId.value = fingerprint;
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      isLoading.value = false;
    }
  };

  return { isLoading, authorization, authType, visitorId, authenticate };
};