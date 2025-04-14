import { useState } from "react";
import toast from "react-hot-toast";

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
        validationErrors.email = "Email is required";
      } else if (!validateEmail(values.email)) {
        validationErrors.email = "Email format is invalid";
      }

      if (!values.username) {
        validationErrors.username = "Username is required";
      }

      if (!values.password) {
        validationErrors.password = "Password is required";
      } else if (values.password.length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      }
    } else if (formType === "profile") {
      if (!values.password) {
        validationErrors.password = "Current password is required";
      }

      if (values.username && values.username.trim() === "") {
        validationErrors.username = "Username cannot be empty";
      }
    } else if (formType === "forgotPassword") {
      if (!values.email) {
        validationErrors.email = "Email is required";
      } else if (!validateEmail(values.email)) {
        validationErrors.email = "Email format is invalid";
      }
    } else if (formType === "resetPassword") {
      if (!values.password) {
        validationErrors.password = "New password is required";
      } else if (values.password.length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      }
      if (!values.password_confirmation) {
        validationErrors.password_confirmation =
          "Please confirm your new password";
      } else if (values.password !== values.password_confirmation) {
        validationErrors.password_confirmation = "Passwords do not match";
      }
    } else {
      // Validation pour le login
      if (!values.email) {
        validationErrors.email = "Email is required";
      }

      if (values.email && !validateEmail(values.email)) {
        validationErrors.email = "Email format is invalid";
      }

      if (!values.password) {
        validationErrors.password = "Password is required";
      }
    }

    setErrors(validationErrors);
    Object.values(validationErrors).forEach((error) => {
      toast.error(error);
    });
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (callback) => {
    const isValid = validate();
    if (!isValid) return;
    setLoading(true);
    toast
      .promise(callback(values), {
        loading: "loading...",
        success: (res) => res?.message,
        error: (err) => err?.message || err,
      })
      .finally(() => setLoading(false));
  };

  return {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
}
