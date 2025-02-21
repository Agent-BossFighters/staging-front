import Cookies from "js-cookie";

export const AuthUtils = {
  setAuthToken: (token) => {
    Cookies.set("agent-auth", token, {
      secure: true,
      sameSite: "strict",
    });
  },

  getAuthToken: () => {
    return Cookies.get("agent-auth");
  },

  setUserData: (userData) => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...userData,
      }),
    );
  },

  getUserData: () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  },

  clearAuth: () => {
    Cookies.remove("agent-auth");
    localStorage.removeItem("user");
  },
};

export const cleanUserData = (userData) => {
  const { id, username, isPremium, slotUnlockedId, level, experience } =
    userData;
  return {
    id,
    username,
    isPremium,
    slotUnlockedId,
    level,
    experience,
  };
};
