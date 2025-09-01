import {
  HashRouter as Router,
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import EmbedDatalab from "./features/embed/EmbedDatalab";
import Layout from "@layout/main.layout";
import HomePage from "@pages/static/home.page";
import { IndexRoutes } from "@pages/index.routes";
import { AuthProvider } from "@context/auth.context";
import { GameConstantsProvider } from "@context/gameConstants.context";
import { UserPreferenceProvider } from "@context/userPreference.context";
import { PrivyWalletProvider } from "@context/wallet.context";
import PageViewTracker from "@utils/umamiPageViewTracker";

export default function App() {
  return (
    <Router>
      <PageViewTracker />
      <AuthProvider>
        <UserPreferenceProvider>
          <GameConstantsProvider>
            <PrivyWalletProvider>
              <Routes>
                {/* Routes avec layout principal */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  {IndexRoutes.map((route, index) => (
                    <Route key={index} {...route} />
                  ))}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>

                {/* Route d'embed SANS layout (iframe) */}
                <Route path="/embed/datalab" element={<EmbedDatalab />} />
              </Routes>
            </PrivyWalletProvider>
          </GameConstantsProvider>
        </UserPreferenceProvider>
      </AuthProvider>
    </Router>
  );
}
