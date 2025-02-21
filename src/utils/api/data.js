import { kyInstance } from "./ky-config";
import toast from "react-hot-toast";

// Fonction pour récupérer les données
export async function getData(object) {
  try {
    const response = await kyInstance.get(object).json();
    return response;
  } catch (error) {
    let errorData = await error.responseData.error;
    toast.error(errorData);
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
    let errorData = await error.responseData.error;
    toast.error(errorData);
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
    let errorData = await error.responseData.error;
    toast.error(errorData);
  }
}

// Fonction pour supprimer les données
export async function deleteData(object) {
  try {
    const response = await kyInstance.delete(object);
    return response;
  } catch (error) {
    let errorData = await error.responseData.error;
    toast.error(errorData);
  }
}
