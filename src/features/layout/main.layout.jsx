import { Outlet } from 'react-router-dom';
import Header from './header/header.jsx';
import Footer from './footer/footer.jsx';

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
