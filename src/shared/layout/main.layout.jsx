import { Outlet, useLocation } from "react-router-dom";
import Header from "./header/header.jsx";
import Footer from "./footer/footer.jsx";
import { Toaster } from "react-hot-toast";
import { A } from "@img/index";
import CookieBanner from "@shared/ui/cookie-banner.jsx";

export default function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="grid grid-rows-layout min-h-screen relative">
      {/* Background color for non-dashboard pages */}
      {!isDashboard && (
        <div className="absolute inset-x-0 top-[80px] bottom-[50px] -z-20 bg-[#212121]" />
      )}

      {/* Background Image */}
      <div
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 bg-no-repeat bg-[length:626px_600px] ${
          isDashboard ? "opacity-50" : "opacity-20"
        }`}
        style={{
          backgroundImage: `url(${A})`,
          width: "626px",
          height: "600px",
        }}
      />

      {/* Header (row 1) */}
      <Header />

      {/* Main content (row 2) */}
      <main className="">
        <Outlet />
      </main>

      {/* Footer (row 3) */}
      <Footer />

      {/* Background overlay */}
      <div className="absolute inset-0 bg-background/80 z-[-5]" />

      {/* Toaster & Cookie Banner */}
      <Toaster />
      <CookieBanner />
    </div>
  );
}
