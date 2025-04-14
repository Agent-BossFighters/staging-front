import { Link } from "react-router-dom";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import useForm from "@features/users/hook/useForm";
import { authSignInUp } from "@api/auth.api";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const { values, errors, loading, handleChange, handleSubmit } = useForm(
    {
      email: "",
    },
    "forgotPassword"
  );

  const handleForgotPassword = async (data) => {
    const payload = {
      email: data.email,
    };

    try {
      const response = await authSignInUp("v1/password", payload);
      toast.success(
        response.message || "Reset instructions have been sent to your email"
      );
    } catch (error) {
      toast.error(error.message || "Failed to send reset instructions");
    }
  };

  return (
    <div className="flex items-center justify-center h-full gap-4">
      <div className="border-2 border-border flex flex-col items-center justify-center gap-4 p-5 rounded-lg md:w-2/3 lg:w-1/4">
        <h1 className="text-3xl font-bold pb-5">
          <span className="text-primary text-4xl">R</span>ESET PASSWORD
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(handleForgotPassword);
          }}
          className="flex flex-col items-center justify-center gap-6 w-full"
        >
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <Button type="submit" disabled={loading} className="w-full h-12">
            {loading ? "Loading..." : "Send Reset Instructions"}
          </Button>
        </form>
        <div className="w-full text-xs flex justify-end">
          <p>Remember your password?&nbsp;</p>
          <Link to="/users/login" className="text-primary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
