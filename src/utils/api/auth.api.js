import Cookies from "js-cookie";
import { kyInstance } from "@api/ky-config";

export async function authSignInUp(object, data) {
  try {
    const response = await kyInstance.post(object, {
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
    throw new Error(errorData);
  }
}

export async function authSignOut() {
  try {
    const accessToken = Cookies.get("agent-auth");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    let response = await kyInstance.post(`signout`, {});
    Cookies.remove("agent-auth");
    return response;
  } catch (error) {
    const errorData = await error.responseData.error;
    throw new Error(errorData);
  }
}
