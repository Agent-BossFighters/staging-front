import { useState } from "react";

export default function useForm(initialValues = {}) {
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

  const validate = () => {
    let validationErrors = {};
    if (!values.username) {
      validationErrors.username = "Le nom d'utilisateur est requis";
    }
    if (!values.password) {
      validationErrors.password = "Le mot de passe est requis";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (callback) => {
    if (validate()) {
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
