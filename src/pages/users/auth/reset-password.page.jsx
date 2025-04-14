import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import useForm from "@features/users/hook/useForm";
import { authSignInUp } from "@api/auth.api";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("reset_password_token");

  const { values, errors, loading, handleChange, handleSubmit } = useForm(
    {
      password: "",
      password_confirmation: "",
    },
    "resetPassword"
  );

  const handleResetPassword = async (data) => {
    const payload = {
      user: {
        reset_password_token: resetToken,
        password: data.password,
        password_confirmation: data.password_confirmation,
      },
    };

    toast.promise(authSignInUp("v1/password", payload, "PUT"), {
      loading: "Resetting password...",
      success: (res) => {
        navigate("/users/login");
        return res.message;
      },
      error: (err) => {
        return err.message;
      },
    });
  };

  if (!resetToken) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="border-2 border-border flex flex-col items-center justify-center gap-4 p-5 rounded-lg md:w-2/3 lg:w-1/4">
          <h1 className="text-3xl font-bold pb-5 text-red-500">
            Invalid Reset Link
          </h1>
          <p>The password reset link is invalid or has expired.</p>
          <Button
            onClick={() => navigate("/users/password/forgot")}
            className="w-full h-12"
          >
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full gap-4">
      <div className="border-2 border-border flex flex-col items-center justify-center gap-4 p-5 rounded-lg md:w-2/3 lg:w-1/4">
        <h1 className="text-3xl font-bold pb-5">
          <span className="text-primary text-4xl">N</span>EW PASSWORD
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(handleResetPassword);
          }}
          className="flex flex-col items-center justify-center gap-6 w-full"
        >
          <Input
            type="password"
            name="password"
            placeholder="New Password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}

          <Input
            type="password"
            name="password_confirmation"
            placeholder="Confirm New Password"
            value={values.password_confirmation}
            onChange={handleChange}
          />
          {errors.password_confirmation && (
            <p className="text-red-500">{errors.password_confirmation}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full h-12">
            {loading ? "Loading..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
