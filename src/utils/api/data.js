import { kyInstance } from "./ky-config";
import toast from "react-hot-toast";

const handleError = async (error) => {
  try {
    const errorData = await error.response?.json();
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion ou rafraîchir le token
      window.location.href = "/login";
      return null;
    }
    return errorData?.error || "Une erreur est survenue";
  } catch (e) {
    return "Une erreur est survenue";
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
    return null;
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
    return response.json();
  } catch (error) {
    if (error.responseData?.error) {
      toast.error(error.responseData.error);
    }
    return null;
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
    return response.json();
  } catch (error) {
    if (error.responseData?.error) {
      toast.error(error.responseData.error);
    }
    return null;
  }
}

// Fonction pour supprimer les données
export async function deleteData(object) {
  try {
    const response = await kyInstance.delete(object);
    return response;
  } catch (error) {
    if (error.responseData?.error) {
      toast.error(error.responseData.error);
    }
    return null;
  }
}
