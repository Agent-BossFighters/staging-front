import { Outlet } from 'react-router-dom';
import Header from '@features/layout/header.jsx';
import Footer from '@features/layout/footer.jsx';

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
