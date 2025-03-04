import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@shared/ui/button";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Si pas de session_id, on redirige vers cancel
    if (!sessionId) {
      navigate("/payments/cancel");
      return;
    }

    const verifyPayment = async () => {
      try {
        const authToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("agent-auth="))
          ?.split("=")[1];

        const response = await fetch(
          `http://localhost:3000/payments/checkout/success?session_id=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            credentials: "include",
          }
        );

        const data = await response.json();
        console.log("Payment verification response:", data);

        // Si le paiement n'est pas réussi, on redirige vers cancel
        if (!data.success || data.status !== "complete") {
          navigate("/payments/cancel");
          return;
        }

        // Si succès, on redirige vers le dashboard après 5 secondes
        const timer = setTimeout(() => {
          navigate("/dashboard");
        }, 5000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Payment verification error:", error);
        navigate("/payments/cancel");
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  // On ne montre le message de succès que si on est sur la page success
  // et qu'on a un sessionId
  if (!sessionId) {
    return null;
  }

  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful!
        </h1>
        <p className="text-lg text-muted-foreground">
          Thank you for your subscription. Your account has been updated with
          premium access.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          You will be redirected to the dashboard in 5 seconds...
        </p>
        <Link to="/dashboard">
          <Button className="mt-4">Go to Dashboard Now</Button>
        </Link>
      </div>
    </div>
  );
}
