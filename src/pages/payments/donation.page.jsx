import { useState } from "react";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { useStripeCheckout } from "@features/stripe/hooks/useStripeCheckout";
import toast from "react-hot-toast";
import PricingCard from "@features/stripe/PricingCard";

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

  const donationPlans = {
    why: {
      name: "💖 Why Support Us?",
      features: [
        "• Support ongoing development and innovation",
        "• Keep our platform free and accessible",
        "• Help us introduce new features and improvements",
      ],
      comingSoonFeatures: [],
    },
    they: {
      name: "🙌 They Support Us",
      features: [
        "Join our amazing supporters",
        "Help make this project possible",
        "Be part of our community",
      ],
      comingSoonFeatures: [],
    },
  };

  return (
    <div className="w-5/6 mx-auto h-full py-16">
      <h1 className="text-4xl font-bold mb-4 text-yellow-400 text-center">
        SUPPORT US
      </h1>
      <div className="text-center mb-12">
        <p className="text-muted-foreground max-w-3xl mx-auto text-white">
          Your support makes a difference! By donating, you help us continue to
          improve our services and create a better experience for everyone.
          Every contribution, no matter the size, helps us grow and sustain our
          project. All collected funds will be exclusively used for the
          development of the application, including events, new features, and
          future improvements.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <PricingCard
          plan={donationPlans.why.name}
          price={0}
          features={donationPlans.why.features}
          comingSoonFeatures={donationPlans.why.comingSoonFeatures}
          showPriceAndLabels={false}
          showButton={false}
        />
        <PricingCard
          plan={donationPlans.they.name}
          price={0}
          features={donationPlans.they.features}
          comingSoonFeatures={donationPlans.they.comingSoonFeatures}
          isPremium={true}
          showPriceAndLabels={false}
          showButton={false}
        />
      </div>

      {/* Donation Form */}
      <div className="mt-8 flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="w-full">
          <Input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount ($)"
            className="text-center text-lg h-12"
          />
        </div>
        <Button
          onClick={handleDonation}
          className="w-full bg-primary text-background hover:bg-primary/90 font-bold uppercase py-6"
        >
          Donate
        </Button>
        <p className="text-xl font-bold text-center">
          Thank you for your generosity! 🙌
        </p>
      </div>
    </div>
  );
}
