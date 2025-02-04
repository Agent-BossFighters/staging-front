import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { authSignInUp } from "@api/auth.api";
import useForm from "@features/users/hook/useForm";

export default function Register() {
  const { values, errors, loading, handleChange, handleSubmit } = useForm(
    {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    "register",
  );

  const handleRegister = async (data) => {
    if (data.password !== data.confirmPassword) {
      console.error("Les mots de passe ne correspondent pas");
      return;
    }
    const payload = {
      user: {
        email: data.email,
        username: data.username,
        password: data.password,
      },
    };

    try {
      const userData = await authSignInUp("/api/v1/signup", payload);
      console.log("Utilisateur enregistré:", userData);
    } catch (err) {
      console.error("Erreur d'enregistrement:", err);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleRegister);
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
        type="email"
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

      <Input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={values.confirmPassword}
        onChange={handleChange}
      />
      {errors.confirmPassword && (
        <p className="text-red-500">{errors.confirmPassword}</p>
      )}

      <Button
        type="submit"
        className="w-full text-background"
        disabled={loading}
      >
        {loading ? "Chargement..." : "Sign up"}
      </Button>
    </form>
  );
}
