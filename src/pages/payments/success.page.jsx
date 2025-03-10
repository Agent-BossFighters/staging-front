import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { kyInstance } from "@utils/api/ky-config";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      // Vérifier le statut de l'abonnement
      const checkSubscription = async () => {
        try {
          const response = await kyInstance
            .get(`v1/payments/checkout/success`, {
              searchParams: {
                session_id: sessionId,
              },
            })
            .json();
          setSubscriptionDetails(response);
        } catch (error) {
          console.error("Error fetching subscription details:", error);
        }
      };

      checkSubscription();
    }

    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [sessionId, navigate]);

  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-green-600">
          Subscription Activated!
        </h1>
        {subscriptionDetails && (
          <div className="text-lg text-muted-foreground">
            <p>Your premium access is now active.</p>
            <p className="mt-2">
              Next payment:{" "}
              {new Date(
                subscriptionDetails.current_period_end * 1000
              ).toLocaleDateString()}
            </p>
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-4">
          You will be redirected to the dashboard in 5 seconds...
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
          <Link to="/payments/customer-portal">
            <Button variant="outline">Manage Subscription</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
