import ResetPassword from "@features/users/auth/reset-password";

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center h-full gap-4">
      <div className="border-2 border-border flex flex-col items-center justify-center gap-4 p-5 rounded-lg md:w-2/3 lg:w-1/4">
        <h1 className="text-3xl font-bold pb-5">
          <span className="text-primary text-4xl">N</span>EW PASSWORD
        </h1>
        <ResetPassword />
      </div>
    </div>
  );
}
