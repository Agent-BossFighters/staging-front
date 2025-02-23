import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { authSignInUp } from "@api/auth.api";
import useForm from "@features/users/hook/useForm";
import { useAuth } from "@context/auth.context";
import { cleanUserData } from "@utils/api/auth.utils";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { values, errors, loading, handleChange, handleSubmit } = useForm(
    {
      email: "",
      password: "",
    },
    "login"
  );

  const handleLogin = async (data) => {
    const payload = {
      user: {
        email: data.email,
        password: data.password,
      },
    };
    toast.promise(authSignInUp("v1/login", payload), {
      loading: "Signing in...",
      success: (res) => {
        login(cleanUserData(res.userData.user), res.userData.token);
        navigate("/dashboard");
        return res.userData.message;
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
        handleSubmit(handleLogin);
      }}
      className="flex flex-col items-center justify-center gap-6 w-full"
    >
      <Input
        type="text"
        name="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange}
      />
      {errors.email && <p className="text-red-500">{errors.email}</p>}

      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={values.password}
        onChange={handleChange}
      />
      {errors.password && <p className="text-red-500">{errors.password}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 text-background"
      >
        {loading ? "Loading..." : "Login"}
      </Button>
    </form>
  );
}
