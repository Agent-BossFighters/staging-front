import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@shared/ui/button";

export default function CancelPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    console.log("CancelPage mounted - Payment cancelled/failed", { status });
  }, [status]);

  const getMessage = () => {
    switch (status) {
      case "failure":
        return "Your payment could not be processed. Please try again with a different payment method.";
      case "cancel":
        return "You cancelled the payment process. No charges were made to your account.";
      default:
        return "The payment was not completed. No charges were made to your account.";
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-red-600">
          {status === "failure" ? "Payment Failed" : "Payment Cancelled"}
        </h1>
        <p className="text-lg text-muted-foreground">{getMessage()}</p>
        <div className="flex justify-center gap-4 mt-8">
          <Link to="/payments/pricing">
            <Button variant="default" className="font-bold">
              TRY AGAIN
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="font-bold">
              RETURN TO DASHBOARD
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
