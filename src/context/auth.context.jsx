import { createContext, useContext, useEffect, useState } from "react";
import { AuthUtils, cleanUserData } from "@utils/api/auth.utils";
import { useNavigate } from "react-router-dom";
import { kyInstance } from "@utils/api/ky-config";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);
export let isPremiumContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      const userData = AuthUtils.getUserData();
      const token = AuthUtils.getAuthToken();

      if (userData && token) {
        try {
          const response = await kyInstance.get(`v1/users/${userData.id}`);
          const cleanedData = cleanUserData(userData);
          if (userData.is_admin !== undefined) {
            cleanedData.is_admin = userData.is_admin;
          }
          setUser(cleanedData);
          setIsPremium(cleanedData.isPremium || false);
        } catch (error) {
          if (
            error.responseData?.error === "Invalid session. Please reconnect."
          ) {
            toast.error("Your session has expired, please reconnect", {
              autoClose: 5000,
            });
            await logout();
          }
        }
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
        setIsPremium(userData.isPremium);
      } catch (error) {
        // Gérer l'erreur silencieusement
      }
    };

    fetchPremiumStatus();
  }, [user]);

  const updateUserAndToken = (userData, token) => {
    const cleanedUserData = cleanUserData(userData);
    cleanedUserData.is_admin = userData.is_admin
      ? userData.is_admin
      : undefined;
    AuthUtils.setAuthToken(token);
    AuthUtils.setUserData(cleanedUserData);
    setUser(cleanedUserData);
    setIsPremium(cleanedUserData.isPremium || false);
  };

  const login = (userData, token) => {
    if (!userData || !token) {
      return;
    }

    try {
      const cleanedUserData = cleanUserData(userData);
      cleanedUserData.is_admin = userData.is_admin
        ? userData.is_admin
        : undefined;
      AuthUtils.setAuthToken(token);
      AuthUtils.setUserData(cleanedUserData);
      setUser(cleanedUserData);
    } catch (error) {
      toast.error("Failed to complete login process");
    }
  };

  const updateToken = (newToken) => {
    AuthUtils.setAuthToken(newToken);
  };

  const logout = async () => {
    try {
      await AuthUtils.clearAuth();
      setUser(null);
      setIsPremium(false);
      navigate("/users/login");
    } catch (error) {
      AuthUtils.clearAuth();
      setUser(null);
      setIsPremium(false);
      navigate("/users/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUserAndToken,
        updateToken,
      }}
    >
      <isPremiumContext.Provider value={{ isPremium, setIsPremium }}>
        {!isLoading && children}
      </isPremiumContext.Provider>
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

export const usePremium = () => {
  const context = useContext(isPremiumContext);

  if (!context) {
    throw new Error("usePremium must be used within a PremiumContext");
  }

  return context;
};
