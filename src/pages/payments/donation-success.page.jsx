import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { kyInstance } from "@utils/api/ky-config";
import toast from "react-hot-toast";

export default function DonationSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [donationDetails, setDonationDetails] = useState(null);
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkDonation = async () => {
      if (!sessionId) {
        toast.error("No session ID found");
        navigate("/payments/cancel");
        return;
      }

      try {
        setIsLoading(true);

        const response = await kyInstance
          .get("v1/payments/donations/success", {
            searchParams: {
              session_id: sessionId,
            },
          })
          .json();

        if (!isMounted) return;

        setDonationDetails(response);

        if (response.success) {
          toast.success("Thank you for your donation!");
        } else {
          toast.error("Donation verification failed");
          navigate("/payments/cancel");
        }
      } catch (error) {
        console.error("Error fetching donation details:", error);
        toast.error("Error verifying donation. Please contact support.");
        navigate("/payments/cancel");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkDonation();

    return () => {
      isMounted = false;
    };
  }, [sessionId, navigate]);

  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-green-600">
          Thank You for Your Support!
        </h1>
        {donationDetails && (
          <div className="text-lg text-muted-foreground">
            <p>
              Your generous donation of{" "}
              {(donationDetails.amount / 100).toFixed(2)}€ has been received.
            </p>
            <p className="mt-2">Your support helps us continue our mission.</p>
          </div>
        )}
        {isLoading ? (
          <p className="text-sm text-muted-foreground mt-4">
            Verifying your donation...
          </p>
        ) : (
          <div className="flex justify-center gap-4 mt-8">
            <Link to="/dashboard">
              <Button className="font-bold">GO TO DASHBOARD</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
