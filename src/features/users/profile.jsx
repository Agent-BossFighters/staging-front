import { Button } from "@ui/button";
import { Input } from "@ui/input";
import useForm from "@features/users/hook/useForm";
import { useAuth } from "@context/auth.context";

export default function Login() {
  const { user } = useAuth();
  const { values, errors, loading, handleChange, handleSubmit } = useForm(
    {
      username: "",
      email: "",
      password: "",
    },
    "login",
  );

  const handleEdit = async (data) => {
    //TODO edit function
    //   try {
    //     const payload = {
    //       user: {
    //         username: data.username,
    //         email: data.email,
    //         password: data.password,
    //       },
    //     };
    //     const response = await authSignInUp("/api/v1/login", payload);
    //     console.log("message", response.message); if (response.token && response.user) {
    //       login(response.user, response.token);
    //       navigate("/dashboard");
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleEdit);
      }}
      className="flex flex-col items-center justify-center gap-4 w-full"
    >
      <Input
        type="text"
        name="username"
        placeholder={user.username}
        value={values.username}
        onChange={handleChange}
      />
      {errors.username && <p className="text-red-500">{errors.username}</p>}

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
        {loading ? "Loading..." : "Edit"}
      </Button>
    </form>
  );
}
