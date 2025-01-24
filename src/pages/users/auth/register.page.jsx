import { Link } from "react-router-dom";
import Register from "@features/users/auth/register";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="border-2 border-border flex flex-col items-center justify-center gap-4 p-5 rounded-lg md:w-2/3 lg:w-1/4">
        <h1 className="text-3xl font-bold pb-5">
          <span className="text-primary text-4xl">R</span>egistration
        </h1>
        <Register />
        <div className="mt-4 w-full text-xs flex justify-end">
          <p>Already have an account?&nbsp;</p>
          <Link to="/users/login" className="text-primary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
