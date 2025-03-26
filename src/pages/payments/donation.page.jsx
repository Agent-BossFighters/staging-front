import { useState } from "react";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { useStripeCheckout } from "@features/stripe/hooks/useStripeCheckout";
import toast from "react-hot-toast";

export default function DonationPage() {
  const { initiateCheckout } = useStripeCheckout();
  const [amount, setAmount] = useState("");

  const handleDonation = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      // Convert amount to cents (Stripe uses cents)
      const amountInCents = Math.round(parseFloat(amount) * 100);
      await initiateCheckout(null, true, amountInCents);
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Failed to process donation. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Support Our Project
          </h1>
          <p className="text-lg text-white mb-8 text-left">
            Your support makes a difference! By donating, you help us continue
            to improve our services and create a better experience for everyone.
            Every contribution, no matter the size, helps us grow and sustain
            our project. All collected funds will be exclusively used for the
            development of the application, including events, new features, and
            future improvements.
          </p>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">
              💖 Why Support Us?
            </h2>
            <ul className="space-y-4 text-lg text-left">
              <li>• Support ongoing development and innovation</li>
              <li>• Keep our platform free and accessible</li>
              <li>• Help us introduce new features and improvements</li>
            </ul>
            <p className="text-xl font-bold mt-6 text-center">
              Thank you for your generosity! 🙌
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-64">
            <Input
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (€)"
              className="text-center text-lg"
            />
          </div>
          <Button
            onClick={handleDonation}
            className="w-64 bg-yellow-400 text-black hover:bg-yellow-500 text-lg py-6 font-bold uppercase"
          >
            Support Us
          </Button>
        </div>
      </div>
    </div>
  );
}
