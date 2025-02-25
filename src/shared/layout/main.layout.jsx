import { Outlet, useLocation } from "react-router-dom";
import Header from "./header/header.jsx";
import Footer from "./footer/footer.jsx";
import { Toaster } from "react-hot-toast";
import { A } from "@img/index";

export default function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <>
      <div className="grid grid-rows-layout min-h-screen relative">
        {/* Background color for non-dashboard pages - main content only */}
        {!isDashboard && (
          <div className="absolute top-[80px] bottom-[50px] left-0 right-0 -z-20 bg-[#212121]" />
        )}

        {/* Background Image */}
        <div
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 bg-no-repeat ${
            isDashboard
              ? "opacity-50 bg-[length:265px_254px]"
              : "opacity-20 bg-[length:626px_600px]"
          }`}
          style={{
            backgroundImage: `url(${A})`,
            width: isDashboard ? "265px" : "626px",
            height: isDashboard ? "254px" : "600px",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Header />
          <main className="flex-grow px-10 lg:px-0 lg:w-6/7 mx-auto flex flex-col">
            <Outlet />
          </main>
          <Footer />
        </div>

        {/* Background overlay for tables and cards */}
        <div className="absolute inset-0 bg-background/80 z-[-5]" />
      </div>
      <div>
        <Toaster />
      </div>
    </>
  );
}
