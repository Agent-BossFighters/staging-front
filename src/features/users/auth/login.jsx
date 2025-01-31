import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { authSignInUp } from "@api/auth.api";
import useForm from "@features/users/hook/useForm";

export default function Login() {
  const { values, errors, loading, handleChange, handleSubmit } = useForm({
    username: "",
    password: "",
  });

  const handleLogin = async (data) => {
    try {
      const userData = await authSignInUp("login", data);
      console.log(userData);
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
      className="flex flex-col items-center justify-center gap-4 w-full"
    >
      <Input
        type="text"
        name="username"
        placeholder="Username"
        value={values.username}
        onChange={handleChange}
      />
      {errors.username && <p className="text-red-500">{errors.username}</p>}

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
