import Button from '@ui/buttons/button';
import Input from '@ui/input/input';
import { authSignInUp } from '@api/auth.api';
import useForm from '@features/users/hook/useForm';

export default function Register() {
  const { values, errors, loading, handleChange, handleSubmit } = useForm({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async (data) => {
    if (data.password !== data.confirmPassword) {
      console.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const userData = await authSignInUp('/api/v1/signup', data);
      console.log('Utilisateur enregistré:', userData);
    } catch (err) {
      console.error('Erreur d\'enregistrement:', err);
    }
  };

  return (
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(handleRegister);
      }} className="flex flex-col items-center justify-center gap-4 w-full">
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

        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={values.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}

        <Button
          type="submit"
          variant=""
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Sign up'}
        </Button>
      </form>
  );
}
