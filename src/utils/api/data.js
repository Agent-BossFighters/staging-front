import { kyInstance } from "./ky-config";
import toast from "react-hot-toast";
import ky from "ky";
import { BACKEND_URL } from "./ky-config";
import Cookies from "js-cookie";

const handleError = async (error) => {
  try {
    const errorData = await error.response?.json();
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion ou rafraîchir le token
      window.location.href = "/login";
      return null;
    }
    return errorData?.error || "an error has occurred";
  } catch (e) {
    return "an error has occurred";
  }
};

// Fonction pour récupérer les données
export async function getData(object) {
  try {
    const response = await kyInstance.get(object).json();
    return response;
  } catch (error) {
    if (error.responseData?.error) {
      toast.error(error.responseData.error);
    }
    throw error;
  }
}

export async function postData(object, data) {
  try {
    const options = {
      body: data,
      headers: {},
    };
    if (!(data instanceof FormData)) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(data);
    }
    const response = await kyInstance.post(object, options);
    if (response.message) {
      toast.success(response.message);
    }
    return await response.json();
  } catch (error) {
    if (error.responseData?.error) {
      toast.error(error.responseData.error);
    }
    throw error;
  }
}

export async function putData(object, data) {
  try {
    const options = {
      headers: {},
      body: data instanceof FormData ? data : JSON.stringify(data),
    };

    if (!(data instanceof FormData)) {
      options.headers["Content-Type"] = "application/json";
    }

    const response = await kyInstance.put(object, options);
    return await response.json();
  } catch (error) {
    if (error.responseData?.error) {
      toast.error(error.responseData.error);
    }
    throw error;
  }
}

// Fonction pour supprimer les données
export async function deleteData(object) {
  try {
    const response = await kyInstance.delete(object);
    return await response.json();
  } catch (error) {
    if (error.responseData?.error) {
      toast.error(error.responseData.error);
    }
    throw error;
  }
}

// Fonction spécifique pour récupérer les données mensuelles avec un timeout plus long
export async function getMonthlyData(endpoint) {
  try {
    // Instance spécifique avec timeout plus long pour les requêtes mensuelles
    const monthlyKyInstance = ky.create({
      prefixUrl: `${BACKEND_URL}/api/`,
      credentials: "include",
      timeout: 60000, // 60 secondes pour les données mensuelles
      hooks: {
        beforeRequest: [
          (request) => {
            const token = Cookies.get("agent-auth");
            if (token) {
              request.headers.set("Authorization", `Bearer ${token}`);
            }
          },
        ],
      },
    });

    const response = await monthlyKyInstance.get(endpoint).json();
    return response;
  } catch (error) {
    if (error.responseData?.error) {
      toast.error(error.responseData.error);
    }
    throw error;
  }
}
