import { useNavigate } from "react-router-dom";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { authSignInUp } from "@api/auth.api";
import useForm from "@features/users/hook/useForm";
import { useAuth } from "@context/auth.context";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { values, errors, loading, handleChange, handleSubmit } = useForm(
    {
      email: "",
      password: "",
    },
    "login",
  );

  const handleLogin = async (data) => {
    try {
      const payload = {
        user: {
          email: data.email,
          password: data.password,
        },
      };
      const response = await authSignInUp("/v1/login", payload);
      console.log("message", response.message);
      if (response.token && response.user) {
        login(response.user, response.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleLogin);
      }}
      className="flex flex-col items-center justify-center gap-10 w-full"
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
        className="w-full text-background"
      >
        {loading ? "Loading..." : "Login"}
      </Button>
    </form>
  );
}
