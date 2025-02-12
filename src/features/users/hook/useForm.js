import { useState } from "react";

export default function useForm(initialValues = {}, formType = "login") {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validate = () => {
    let validationErrors = {};

    if (formType === "register") {
      if (!values.email) {
        validationErrors.email = "L'email est requis";
      } else if (!validateEmail(values.email)) {
        validationErrors.email = "Format d'email invalide";
      }

      if (!values.username) {
        validationErrors.username = "Le nom d'utilisateur est requis";
      }

      if (!values.password) {
        validationErrors.password = "Le mot de passe est requis";
      }
    } else {
      // Validation pour le login
      if (!values.email && !values.username) {
        validationErrors.email = "L'email ou le nom d'utilisateur est requis";
      }

      if (values.email && !validateEmail(values.email)) {
        validationErrors.email = "Format d'email invalide";
      }

      if (!values.password) {
        validationErrors.password = "Le mot de passe est requis";
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (callback) => {
    const isValid = validate();
    if (isValid) {
      setLoading(true);
      try {
        await callback(values);
      } catch (err) {
        console.error("Erreur lors de la soumission", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
}
