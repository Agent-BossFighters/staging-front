import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { useAuth } from "@context/auth.context";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useProfileForm } from "./hook/useProfileForm";
import { useProfileSubmit } from "./hook/useProfileSubmit";

/**
 * Composant de profil utilisateur
 * Permet de modifier le nom d'utilisateur, l'email et le mot de passe
 */
export default function Profile() {
  const { user } = useAuth();
  
  const {
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
  } = useProfileForm(user);
  
  const { handleSubmit } = useProfileSubmit(
    user,
    formData,
    setFormData,
    validateForm,
    setErrors,
    setSuccessMessage,
    setLoading
  );

  useEffect(() => {
    Object.values(errors).forEach(error => {
      if (error) toast.error(error);
    });
  }, [errors]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center gap-4 w-full"
    >
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 rounded w-full mb-4">
          {successMessage}
        </div>
      )}
      
      {errors.general && (
        <div className="bg-red-100 text-red-700 p-3 rounded w-full mb-4">
          {errors.general}
        </div>
      )}
      
      <div className="w-full">
        <p className="text-sm mb-2">Username</p>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        {errors.username && <p className="text-red-500">{errors.username}</p>}
      </div>

      <div className="w-full">
        <p className="text-sm mb-2">Email</p>
        <Input
          type="email"
          name="email"
          placeholder={user?.email || "Your email"}
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      
      <div className="w-full">
        <p className="text-sm mb-2">Current password (required for any changes)</p>
        <Input
          type="password"
          name="current_password"
          placeholder="Current password"
          value={formData.current_password}
          onChange={handleChange}
        />
        {errors.current_password && <p className="text-red-500">{errors.current_password}</p>}
      </div>
      
      <h3 className="text-lg font-semibold mt-6 self-start">Change password</h3>
      
      <div className="w-full">
        <p className="text-sm mb-2">New password (optional)</p>
        <Input
          type="password"
          name="new_password"
          placeholder="New password"
          value={formData.new_password}
          onChange={handleChange}
        />
        {errors.new_password && <p className="text-red-500">{errors.new_password}</p>}
      </div>
      
      <div className="w-full">
        <p className="text-sm mb-2">Confirm new password</p>
        <Input
          type="password"
          name="new_password_confirmation"
          placeholder="Confirm new password"
          value={formData.new_password_confirmation}
          onChange={handleChange}
        />
        {errors.new_password_confirmation && <p className="text-red-500">{errors.new_password_confirmation}</p>}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-6"
      >
        {loading ? "Updating..." : "Save changes"}
      </Button>
    </form>
  );
}
