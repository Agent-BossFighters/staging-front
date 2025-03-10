import { loadStripe } from "@stripe/stripe-js";
import { kyInstance, FRONTEND_URL } from "@utils/api/ky-config";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function useStripeCheckout() {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const detectLocale = () => {
    const locale = navigator.language;
    const supportedLocales = [
      "auto",
      "bg",
      "cs",
      "da",
      "de",
      "el",
      "en",
      "en-GB",
      "es",
      "es-419",
      "et",
      "fi",
      "fil",
      "fr",
      "fr-CA",
      "hr",
      "hu",
      "id",
      "it",
      "ja",
      "ko",
      "lt",
      "lv",
      "ms",
      "mt",
      "nb",
      "nl",
      "pl",
      "pt",
      "pt-BR",
      "ro",
      "ru",
      "sk",
      "sl",
      "sv",
      "th",
      "tr",
      "vi",
      "zh",
      "zh-HK",
      "zh-TW",
    ];

    if (supportedLocales.includes(locale)) {
      return locale;
    }

    const baseLocale = locale.split("-")[0];
    if (supportedLocales.includes(baseLocale)) {
      return baseLocale;
    }

    return "auto";
  };

  const initiateCheckout = async (priceId) => {
    let loadingToast = null;
    try {
      const authToken = getCookie("agent-auth");
      if (!authToken) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      if (!priceId) {
        toast.error("Price ID is required");
        return;
      }

      console.log("Starting checkout with priceId:", priceId);

      loadingToast = toast.loading("Preparing checkout session...");

      const checkoutData = {
        priceId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        locale: detectLocale(),
        successUrl: `${FRONTEND_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${FRONTEND_URL}/payments/cancel`,
        allowPromotionCodes: true,
        billingAddressCollection: "required",
        paymentMethodTypes: ["card"],
        mode: "subscription",
        customerEmail: null, // Will be set by the backend if needed
      };

      console.log("Sending checkout data:", checkoutData);

      const response = await kyInstance
        .post("v1/payments/checkout/create", {
          json: checkoutData,
        })
        .json();

      console.log("Checkout session response:", response);

      if (response?.url) {
        window.location.assign(response.url);
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (error) {
      console.error("Checkout error:", error);

      let errorMessage = "An error occurred during checkout. Please try again.";

      if (error.response) {
        const errorResponse = error.response;
        try {
          const errorData = await errorResponse.json();
          console.log("Error data:", errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
          try {
            errorMessage = await errorResponse.text();
          } catch (textError) {
            console.error("Error getting response text:", textError);
          }
        }
      }

      toast.error(errorMessage);
    } finally {
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    }
  };

  const redirectToCustomerPortal = async () => {
    let loadingToast = null;
    try {
      const authToken = getCookie("agent-auth");
      if (!authToken) {
        toast.error("Authentication required. Please log in.");
        return;
      }

      loadingToast = toast.loading("Preparing customer portal...");

      const response = await kyInstance
        .post("v1/payments/customer-portal", {
          json: {
            returnUrl: window.location.href,
          },
        })
        .json();

      if (response?.url) {
        window.location.assign(response.url);
      } else {
        throw new Error("No portal URL received");
      }
    } catch (error) {
      console.error("Customer portal error:", error);
      toast.error("Could not access customer portal. Please try again later.");
    } finally {
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    }
  };

  return { initiateCheckout, redirectToCustomerPortal };
}
