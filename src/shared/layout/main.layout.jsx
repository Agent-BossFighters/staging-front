import { Outlet } from 'react-router-dom';
import Header from './header/header.jsx';
import Footer from './footer/footer.jsx';

export default function Layout() {
  return (
    <div className="grid grid-rows-layout min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
