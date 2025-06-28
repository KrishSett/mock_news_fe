import { ref } from 'vue';
import { authService } from '../common/auth.service';

const isLoading = ref(false);


export const useAuth = () => {
  const authenticate = async () => {
    try {
      isLoading.value = true;
      const authToken = await authService.authenticate();

      // Auth-token not found
      if (!authToken) {
        console.log("Auth failed");
        throw new Error("Auth failed");
      }

      const { authTypeValue, fingerprint } = await authService.getHashToken(authToken);
      if (!authTypeValue || !fingerprint) {
        console.log("Hash failed");
        throw new Error("Hash failed");
      }

      console.log("Authenticated", authToken);
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      isLoading.value = false;
    }
  };

  return { isLoading, authenticate };
};