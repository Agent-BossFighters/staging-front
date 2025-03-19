import { useState, useEffect } from "react";

/**
 * Hook personnalisé pour gérer le formulaire du profil utilisateur
 * @param {Object} user - L'utilisateur courant
 * @returns {Object} - Les états et fonctions pour gérer le formulaire
 */
export function useProfileForm(user) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    current_password: "",
    new_password: "",
    new_password_confirmation: ""
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        username: user.username || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.current_password) {
      newErrors.current_password = "Le mot de passe actuel est requis";
    }
    
    if (formData.new_password && formData.new_password.length < 6) {
      newErrors.new_password = "Le nouveau mot de passe doit contenir au moins 6 caractères";
    }
    
    if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = "Les mots de passe ne correspondent pas";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    const hasChanges = 
      formData.username !== user.username || 
      formData.email !== user.email || 
      formData.new_password;
      
    if (!hasChanges) {
      newErrors.general = "Aucune modification à effectuer";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    successMessage,
    setSuccessMessage,
    loading,
    setLoading,
    handleChange,
    validateForm
  };
} 