import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
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
    "login"
  );

  const handleLogin = async (data) => {
    const payload = {
      user: {
        email: data.email.toLowerCase(),
        password: data.password,
      },
    };

    try {
      const response = await authSignInUp("v1/login", payload);

      if (
        !response.userData ||
        !response.userData.user ||
        !response.userData.token
      ) {
        throw new Error("Invalid response from server");
      }

      login(response.userData.user, response.userData.token);
      navigate("/dashboard");

      return response.userData.message;
    } catch (error) {
      throw error;
    }
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

      <Button type="submit" disabled={loading} className="w-full h-12">
        {loading ? "Loading..." : "Login"}
      </Button>

      <div className="w-full text-xs flex justify-end">
        <Link to="/users/password/forgot" className="text-primary">
          Forgot your password?
        </Link>
      </div>
    </form>
  );
}
