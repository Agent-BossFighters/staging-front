import { createContext, useContext, useEffect, useState } from "react";
import { AuthUtils, cleanUserData } from "@utils/api/auth.utils";
import { useNavigate } from "react-router-dom";
import { kyInstance } from "@utils/api/ky-config";

const AuthContext = createContext(null);
export let isPremiumContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const initializeUser = () => {
      const userData = AuthUtils.getUserData();
      const token = AuthUtils.getAuthToken();
      
      if (userData && token) {
        const cleanedData = cleanUserData(userData);
        if (userData.is_admin !== undefined) {
          cleanedData.is_admin = userData.is_admin;
        }
        setUser(cleanedData);
      }
      setIsLoading(false);
    };
    
    initializeUser();
  }, []);
  
  useEffect(() => {
    const fetchPremiumStatus = async () => {
      if (!user) return;
      try {
        const response = await kyInstance.get(`v1/users/${user.id}`);
        const respObject = await response.json();
        const userData = respObject.user;
        isPremiumContext = createContext(userData.isPremium);
      } catch (error) {
        console.error("Erreur lors de la récupération du statut premium:", error);
      }
    };
    
    fetchPremiumStatus();
  }, [user]);

  const login = (userData, token) => {
    const cleanedUserData = cleanUserData(userData);
    cleanedUserData.is_admin = userData.is_admin ? userData.is_admin : undefined;
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
