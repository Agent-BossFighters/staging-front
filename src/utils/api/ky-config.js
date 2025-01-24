import ky from "ky";
import Cookies from "js-cookie";

export const BASE_URL = "http://127.0.0.1:3000"

export const kyInstance = ky.create({
  hooks: {
    beforeRequest: [
      (request) => {
        const token = Cookies.get("agent-auth");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    beforeError: [
      async (error) => {
        const { response } = error;
        if (response) {
          const errorData = await response.json();
          error.responseData = errorData;
        }
        return error;
      },
    ]
    // afterResponse: [
    //   async (request, options, response) => {
    //     if (response.status === 401 && Cookies.get("agent-auth")) {
    //       const refreshToken = Cookies.get("agent-refresh");
    //       if (refreshToken) {
    //         try {
    //           const refreshResponse = await ky.post(
    //             `${BASE_URL}/refresh-token`,
    //             {
    //               json: { refreshToken },
    //             },
    //           );
    //
    //           const newAccessToken =
    //             refreshResponse.headers.get("Authorization");
    //           Cookies.set("agent-auth", newAccessToken, {
    //             secure: true,
    //             sameSite: "strict",
    //           });
    //           return kyInstance(request);
    //         } catch (refreshError) {
    //           Cookies.remove("agent-auth");
    //           Cookies.remove("agent-refresh");
    //           localStorage.removeItem("user");
    //           window.location.href = "/signin";
    //           throw new Error("Vous devez vous reconnecter");
    //         }
    //       } else {
    //         Cookies.remove("agent-auth");
    //         Cookies.remove("agent-refresh");
    //         localStorage.removeItem("user");
    //         window.location.href = "/signin";
    //         throw new Error("Vous devez vous reconnecter");
    //       }
    //     }
    //     return response;
    //   },
    // ],
  },
});
