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
    return supportedLocales.includes(locale)
      ? locale
      : supportedLocales.includes(locale.split("-")[0])
        ? locale.split("-")[0]
        : "auto";
  };

  const initiateCheckout = async (
    priceId,
    isDonation = false,
    amount = null
  ) => {
    let loadingToast = null;
    try {
      const authToken = getCookie("agent-auth");
      console.log("Auth token:", authToken ? "Present" : "Missing");

      if (!authToken) {
        toast.error("Please log in to continue with your donation");
        return;
      }

      if (!priceId && !isDonation) {
        toast.error("Price ID is required for subscriptions");
        return;
      }

      if (isDonation && !amount) {
        toast.error("Please enter a donation amount");
        return;
      }

      if (isDonation && amount < 100) {
        toast.error("Minimum donation amount is 1€");
        return;
      }

      console.log("Starting checkout with:", { priceId, isDonation, amount });

      loadingToast = toast.loading("Preparing checkout session...");

      const endpoint = isDonation
        ? "v1/payments/donation/create"
        : "v1/payments/checkout/create";

      // Construire les URLs complètes avec le hash pour le routage
      const successUrl = isDonation
        ? `${window.location.origin}/#/payments/donations/success`
        : `${window.location.origin}/#/payments/success`;

      const checkoutData = {
        priceId,
        locale: detectLocale(),
        isDonation,
        amount: isDonation ? amount : undefined,
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/#/payments/cancel`,
      };

      console.log("Sending checkout data:", checkoutData);

      const response = await kyInstance.post(endpoint, {
        json: checkoutData,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();
      console.log("Checkout session response:", data);

      if (data?.url) {
        console.log("Redirecting to Stripe checkout:", data.url);
        window.location.assign(data.url);
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      let errorMessage = "An error occurred during checkout. ";

      if (error.response) {
        try {
          const errorData = await error.response.json();
          console.log("Error data:", errorData);

          if (error.response.status === 401) {
            errorMessage = "Please log in to continue with your donation";
            window.location.href = "/#/users/login";
          } else if (error.response.status === 422) {
            errorMessage =
              errorData.error || "Please check your input and try again";
          } else {
            errorMessage += errorData.error || "Please try again later.";
          }
        } catch (e) {
          errorMessage += "Please try again later.";
        }
      } else {
        errorMessage += error.message || "Please try again later.";
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
      let errorMessage = "Could not access customer portal. ";

      if (error.response) {
        try {
          const errorData = await error.response.json();
          console.log("Error details:", errorData);

          // Gestion spécifique de l'erreur de customer_id manquant
          if (errorData.error === "No Stripe customer ID found") {
            errorMessage =
              "Your subscription information seems to be missing. Please try subscribing again or contact support.";
          } else {
            errorMessage += errorData.error || "Please try again later.";
          }
        } catch (e) {
          errorMessage += "Please try again later.";
        }
      }

      toast.error(errorMessage);
    } finally {
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    }
  };

  return { initiateCheckout, redirectToCustomerPortal };
}
