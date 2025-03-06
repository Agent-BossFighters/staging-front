import { loadStripe } from "@stripe/stripe-js";
import { api } from "@api/ky";

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

      const baseUrl = window.location.origin.replace(/\/+$/, "");
      const successUrl = `${baseUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/payments/cancel`;

      console.log("Initiating checkout with URLs:", { successUrl, cancelUrl });

      const data = await api
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

      if (data.url) {
        console.log("Redirecting to Stripe checkout:", data.url);
        window.location.assign(data.url);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return { initiateCheckout };
}
