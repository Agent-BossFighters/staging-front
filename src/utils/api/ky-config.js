import ky from "ky";
import Cookies from "js-cookie";
import { AuthUtils } from "./auth.utils";
// Détermine si on est en mode test ou production
const isTestMode = import.meta.env.VITE_ENV === "test";

// Sélectionne les URLs appropriées selon le mode
export const FRONTEND_URL = isTestMode
  ? import.meta.env.VITE_FRONTEND_TEST_URL
  : import.meta.env.VITE_FRONTEND_PROD_URL;

export const BACKEND_URL = isTestMode
  ? import.meta.env.VITE_BACKEND_TEST_URL
  : import.meta.env.VITE_BACKEND_PROD_URL;

export const kyInstance = ky.create({
  prefixUrl: `${BACKEND_URL}/api/`,
  credentials: "include",
  hooks: {
    beforeRequest: [
      (request) => {
        const token = Cookies.get("agent-auth");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
        console.log("Request URL:", request.url);
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error;
        if (response) {
          const errorData = await response.json();
          if (response.status === 401) {
            if (errorData.error === 'Invalid session. Please reconnect.') {
              AuthUtils.clearAuth();
              window.location.href = "/#/users/login";
          } else {
            console.log("401 error but not session invalidation:", errorData.error);
          }
        }
          error.responseData = errorData;
        }
        return error;
      },
    ],
    // Dans after reponse, check si on a un user, si oui on le remet dans le local storage en utilisant le "setUserData"
    afterResponse: [
      // (request, options, response) => {
      //   const user = response.json();
      //   if (user) {
      //     setUserData(user);
      //   }
      // },
    ],
  },
});
