import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { authSignInUp } from "@api/auth.api";
import useForm from "@features/users/hook/useForm";

export default function Register() {
  const navigate = useNavigate();
  const { values, loading, handleChange, handleSubmit } = useForm(
    {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    "register"
  );

  const handleRegister = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    const payload = {
      user: {
        email: data.email,
        username: data.username,
        password: data.password,
      },
    };
    toast.promise(authSignInUp("v1/signup", payload), {
      loading: "Signing up...",
      success: (res) => {
        navigate("/users/login");
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
        handleSubmit(handleRegister);
      }}
      className="flex flex-col items-center justify-center gap-6 w-full"
    >
      <Input
        type="text"
        name="username"
        placeholder="Username"
        value={values.username}
        onChange={handleChange}
      />
      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange}
      />

      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={values.password}
        onChange={handleChange}
      />

      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={values.confirmPassword}
        onChange={handleChange}
      />

      <Button
        type="submit"
        className="w-full h-12 text-background"
        disabled={loading}
      >
        {loading ? "Chargement..." : "Sign up"}
      </Button>
    </form>
  );
}
