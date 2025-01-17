import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@pages/layout/main.layout';
import HomePage from '@pages/index/home.page';

export default function App () {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

