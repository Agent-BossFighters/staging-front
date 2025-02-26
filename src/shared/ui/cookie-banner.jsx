import { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("auth_cookie_acknowledged")) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("auth_cookie_acknowledged", "true");
    setShowBanner(false);
  };

  return (
    showBanner && (
      <CookieConsent
        location="bottom"
        buttonText="OK"
        onAccept={handleAccept}
        style={{ background: "#222" }}
        buttonStyle={{ color: "#fff", background: "#4CAF50" }}
      >
        This site only uses a cookie for authentication.
      </CookieConsent>
    )
  );
}
