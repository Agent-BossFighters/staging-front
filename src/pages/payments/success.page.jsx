import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@shared/ui/button";

export default function SuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Si Stripe nous a redirigé ici, c'est que le paiement est réussi
    // On redirige vers le dashboard après 5 secondes
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
