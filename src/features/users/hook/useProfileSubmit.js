import toast from "react-hot-toast";
import { AuthUtils } from "@utils/api/auth.utils";
import { kyInstance } from "@utils/api/ky-config";

/**
 * Mettre à jour le localStorage avec les nouvelles données utilisateur
 * @param {Object} formData - Les données du formulaire
 * @param {Boolean} isChangingEmail - Indique si l'email est modifié
 */
function updateLocalStorage(formData, isChangingEmail) {
  if (localStorage.getItem("user")) {
    const userData = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem("user", JSON.stringify({
      ...userData,
      username: formData.username,
      ...(isChangingEmail && { email: formData.email })
    }));
  }
}

/**
 * Générer un message de succès basé sur les modifications effectuées
 * @param {Object} formData - Les données du formulaire
 * @param {Object} user - L'utilisateur courant
 * @param {Boolean} isChangingEmail - Indique si l'email est modifié
 * @param {Boolean} isChangingPassword - Indique si le mot de passe est modifié
 * @returns {String} - Le message de succès
 */
function generateSuccessMessage(formData, user, isChangingEmail, isChangingPassword) {
  const changes = [];
  
  if (formData.username !== user.username) changes.push("username");
  if (isChangingEmail) changes.push("email");
  if (isChangingPassword) changes.push("password");
  
  if (changes.length > 1) {
    const lastChange = changes.pop();
    return `${changes.join(", ")} and ${lastChange} updated successfully`;
  } else if (changes.length === 1) {
    return `${changes[0]} updated successfully`;
  } else {
    return "Profile updated successfully";
  }
}

/**
 * Gérer la réponse de l'API
 * @param {Response} response
 * @param {Object} options 
 */
async function handleResponse(response, { formData, setFormData, isChangingEmail, isChangingPassword, user, setSuccessMessage }) {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.error || errorData.errors?.join(', ') || `Error ${response.status}: ${response.statusText}`;
    } catch (e) {
      errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
    }
    
    throw new Error(errorMessage);
  }
  
  try {
    const responseText = await response.text();
    if (responseText) {
      JSON.parse(responseText);
    }
  } catch (e) {
    console.warn("Unable to parse the response in JSON:", e);
  }
  
  // Mettre à jour les données utilisateur localement
  updateLocalStorage(formData, isChangingEmail);
  
  // Message de succès adapté aux modifications effectuées
  const successMsg = generateSuccessMessage(formData, user, isChangingEmail, isChangingPassword);
  toast.success(successMsg);
  setSuccessMessage(successMsg);
  
  // Réinitialiser les champs de mot de passe
  setFormData(prevState => ({
    ...prevState,
    current_password: "",
    new_password: "",
    new_password_confirmation: ""
  }));
  
  // Rafraîchir la page pour mettre à jour l'affichage
  setTimeout(() => {
    window.location.reload();
  }, 1500);
}

/**
 * Gérer les erreurs lors de la soumission du formulaire
 * @param {Error} error
 * @param {Function} setErrors
 */
function handleError(error, setErrors) {
  
  if (error.message.includes("password") || error.message.includes("Password")) {
    setErrors({ current_password: "Current password is incorrect" });
    toast.error("Current password is incorrect");
  } else {
    setErrors({ general: error.message || "An error occurred. Please try again." });
    toast.error(error.message || "An error occurred. Please try again.");
  }
}

/**
 * Hook personnalisé pour gérer la soumission du profil utilisateur
 * @param {Object} user
 * @param {Object} formData
 * @param {Function} setFormData
 * @param {Function} validateForm
 * @param {Function} setErrors
 * @param {Function} setSuccessMessage
 * @param {Function} setLoading
 * @returns {Object}
 */
export function useProfileSubmit(user, formData, setFormData, validateForm, setErrors, setSuccessMessage, setLoading) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const token = AuthUtils.getAuthToken();
      
      const isChangingPassword = formData.new_password && formData.new_password.trim() !== '';
      const isChangingEmail = formData.email && formData.email !== user.email;
      
      // Construire les données selon le format exact spécifié
      const dataToUpdate = {
        user: {
          username: formData.username,
          current_password: formData.current_password
        }
      };

      // Ajouter l'email s'il a été modifié
      if (isChangingEmail) {
        dataToUpdate.user.email = formData.email;
      }
      
      // Ajouter le nouveau mot de passe s'il a été fourni
      if (isChangingPassword) {
        dataToUpdate.user.password = formData.new_password;
      }
      
      const response = await kyInstance.put(`v1/users/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToUpdate)
      });

      await handleResponse(response, { formData, setFormData, isChangingEmail, isChangingPassword, user, setSuccessMessage });
      
    } catch (error) {
      handleError(error, setErrors);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit };
} 