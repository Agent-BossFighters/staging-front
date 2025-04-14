import Cookies from "js-cookie";
import { kyInstance } from "@api/ky-config";
import { AuthUtils } from "./auth.utils";

export async function authSignInUp(object, data, method = "POST") {
  try {
    const response = await kyInstance[method.toLowerCase()](object, {
      json: data,
    });
    const userData = await response.json();
    if (userData) {
      return {
        userData,
      };
    }
  } catch (error) {
    let errorData =
      (await error?.responseData?.status?.message) || error?.responseData.error;

    // Ne pas effacer les données d'authentification pour la réinitialisation de mot de passe
    if (
      errorData === "Invalid session. Please reconnect." &&
      !object.includes("password")
    ) {
      AuthUtils.clearAuth();
    }
    throw new Error(errorData);
  }
}

export async function authSignOut() {
  try {
    const accessToken = Cookies.get("agent-auth");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    let response = await kyInstance.post("signout", {});
    Cookies.remove("agent-auth");
    return response;
  } catch (error) {
    const errorData = await error.responseData.error;
    throw new Error(errorData);
  }
}
