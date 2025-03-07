import { loadStripe } from "@stripe/stripe-js";
import { kyInstance, FRONTEND_URL, BACKEND_URL } from "@utils/api/ky-config";
import ky from "ky";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function useStripeCheckout() {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const initiateCheckout = async () => {
    try {
      const authToken = getCookie("agent-auth");

      if (!authToken) {
        console.error("No authentication cookie found");
        return;
      }

      const successUrl = `${FRONTEND_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${FRONTEND_URL}/payments/cancel`;

      console.log("Checkout configuration:", {
        successUrl,
        cancelUrl,
      });

      const response = await ky
        .create({
          prefixUrl: BACKEND_URL,
          credentials: "include",
          hooks: {
            beforeRequest: [
              (request) => {
                request.headers.set("Authorization", `Bearer ${authToken}`);
                console.log("Request URL:", request.url);
              },
            ],
          },
        })
        .post("payments/checkout/create", {
          json: {
            success_url: successUrl,
            cancel_url: cancelUrl,
            payment_method_types: ["card"],
            allow_promotion_codes: true,
            mode: "subscription",
          },
        })
        .json();

      console.log("Server response:", response);

      if (response?.url) {
        console.log("Redirecting to:", response.url);
        window.location.assign(response.url);
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return { initiateCheckout };
}
