import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { kyInstance } from "@utils/api/ky-config";
import { useAuth } from "@context/auth.context";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    let isMounted = true;
    let timer;

    const checkSubscription = async () => {
      if (!sessionId) {
        toast.error("No session ID found");
        navigate("/payments/pricing");
        return;
      }

      try {
        setIsLoading(true);
        // Vérifier le statut de l'abonnement
        const response = await kyInstance
          .get(`v1/payments/checkout/success`, {
            searchParams: {
              session_id: sessionId,
            },
          })
          .json();

        if (!isMounted) return;

        setSubscriptionDetails(response);

        if (response.success) {
          // Mettre à jour le statut premium de l'utilisateur
          if (response.user) {
            login(response.user, response.token);
          }

          toast.success("Payment successful! Welcome to Premium!");

          // Attendre un peu pour laisser le temps au backend de traiter le webhook
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } else {
          toast.error("Payment verification failed");
        }
      } catch (error) {
        console.error("Error fetching subscription details:", error);
        toast.error("Error verifying payment. Please contact support.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSubscription();

    // Redirection après 5 secondes
    timer = setTimeout(() => {
      if (isMounted) {
        navigate("/dashboard");
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [sessionId, navigate, login]);

  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-green-600">
          Subscription Activated!
        </h1>
        {subscriptionDetails && (
          <div className="text-lg text-muted-foreground">
            <p>Your premium access is now active.</p>
            {subscriptionDetails.current_period_end && (
              <p className="mt-2">
                Next payment:{" "}
                {new Date(
                  subscriptionDetails.current_period_end * 1000
                ).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
        {isLoading ? (
          <p className="text-sm text-muted-foreground mt-4">
            Verifying your payment...
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mt-4">
            You will be redirected to the dashboard in 5 seconds...
          </p>
        )}
        <div className="flex justify-center gap-4">
          <Link to="/dashboard">
            <Button className="font-bold">GO TO DASHBOARD</Button>
          </Link>
          <Link to="/payments/pricing">
            <Button variant="outline" className="font-bold">
              MANAGE SUBSCRIPTION
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
