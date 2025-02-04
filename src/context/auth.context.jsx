import { createContext, useContext, useEffect, useState } from "react";
import { AuthUtils, cleanUserData } from "@utils/api/auth.utils";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = () => {
      const userData = AuthUtils.getUserData();
      const token = AuthUtils.getAuthToken();

      if (userData && token) {
        setUser(cleanUserData(userData));
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  const login = (userData, token) => {
    const cleanedUserData = cleanUserData(userData);
    AuthUtils.setAuthToken(token);
    AuthUtils.setUserData(cleanedUserData);
    setUser(cleanedUserData);
  };

  const logout = async () => {
    try {
      await AuthUtils.clearAuth();
      setUser(null);
      navigate("/users/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
