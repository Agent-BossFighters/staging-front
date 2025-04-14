import ForgotPassword from "@features/users/auth/forgot-password";

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center h-full gap-4">
      <div className="border-2 border-border flex flex-col items-center justify-center gap-4 p-5 rounded-lg md:w-2/3 lg:w-1/4">
        <h1 className="text-3xl font-bold pb-5">
          <span className="text-primary text-4xl">F</span>ORGOT PASSWORD
        </h1>
        <ForgotPassword />
      </div>
    </div>
  );
}
