import Cookies from "js-cookie";

export const AuthUtils = {
  setAuthToken: (token) => {
    try {
      Cookies.set("agent-auth", token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    } catch (error) {
      throw error;
    }
  },

  getAuthToken: () => {
    return Cookies.get("agent-auth");
  },

  setUserData: (userData) => {
    try {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userData,
        })
      );
    } catch (error) {
      throw error;
    }
  },

  getUserData: () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },

  clearAuth: () => {
    try {
      Cookies.remove("agent-auth", { path: "/" });
      localStorage.removeItem("user");
    } catch (error) {
      throw error;
    }
  },
};

export const cleanUserData = (userData) => {
  const {
    id,
    username,
    email,
    isPremium,
    slotUnlockedId,
    level,
    experience,
    is_admin,
  } = userData;
  return {
    id,
    username,
    email,
    isPremium,
    slotUnlockedId,
    level,
    experience,
    is_admin,
  };
};
