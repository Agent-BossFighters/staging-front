import { Link } from "react-router-dom";
import Login from "@features/users/auth/login";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-full gap-4">
      <div className="border-2 border-border flex flex-col items-center justify-center gap-4 p-5 rounded-lg md:w-2/3 lg:w-1/4">
        <h1 className="text-3xl font-bold pb-5">
          <span className="text-primary text-4xl">S</span>ign-in
        </h1>
        <Login />
        <div className="w-full text-xs flex justify-end">
          <p>Don&#39;t have an account?&nbsp;</p>
          <Link to="/users/register" className="text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
