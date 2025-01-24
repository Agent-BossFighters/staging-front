import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@layout/main.layout";
import HomePage from "@pages/static/home.page";
import { IndexRoutes } from "@pages/index.routes";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          {IndexRoutes.map((route, index) => (
            <Route key={index} {...route} />
          ))}
        </Route>
      </Routes>
    </Router>
  );
}
