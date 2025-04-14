import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { authSignInUp } from "@api/auth.api";
import useForm from "@features/users/hook/useForm";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { values, errors, loading, handleChange, handleSubmit } = useForm(
    {
      email: "",
    },
    "forgotPassword"
  );

  const handleForgotPassword = async (data) => {
    const payload = {
      user: {
        email: data.email,
      },
    };

    toast.promise(authSignInUp("v1/password/forgot", payload), {
      loading: "Sending reset instructions...",
      success: (res) => {
        return res.userData.status.message;
      },
      error: (err) => {
        return err.message;
      },
    });
  };

  return (
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

      <div className="w-full text-xs flex justify-end">
        <Button
          variant="link"
          onClick={() => navigate("/users/login")}
          className="text-primary"
        >
          Back to Login
        </Button>
      </div>
    </form>
  );
}
