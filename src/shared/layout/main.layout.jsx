import { Outlet } from "react-router-dom";
import Header from "./header/header.jsx";
import Footer from "./footer/footer.jsx";

export default function Layout() {
  return (
    <div className="grid grid-rows-layout min-h-screen">
      <Header />
      <main className="flex-grow px-10 lg:px-0 lg:w-5/6 mx-auto flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
