import { useState } from "react";
import PricingCard from "@features/stripe/PricingCard";
import { useStripeCheckout } from "@features/stripe/hooks/useStripeCheckout";

const PRICING_PLANS = {
  freemium: {
    name: "Freemium",
    price: 0,
    features: ["Basic features", "Limited usage", "Community support"],
  },
  monthly: {
    name: "Monthly",
    price: 29,
    features: [
      "All Freemium features",
      "Unlimited usage",
      "Priority support",
      "Advanced analytics",
    ],
  },
  yearly: {
    name: "Yearly",
    price: 299,
    features: [
      "All Monthly features",
      "2 months free",
      "Dedicated support",
      "Custom solutions",
    ],
  },
};

export default function PricingPage() {
  const { initiateCheckout } = useStripeCheckout();

  const handlePlanSelect = async (planType) => {
    if (planType === "freemium") {
      // Handle freemium signup
      return;
    }

    await initiateCheckout(planType);
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Select the perfect plan for your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PricingCard
          plan={PRICING_PLANS.freemium.name}
          price={PRICING_PLANS.freemium.price}
          features={PRICING_PLANS.freemium.features}
          onSelect={handlePlanSelect}
        />
        <PricingCard
          plan={PRICING_PLANS.monthly.name}
          price={PRICING_PLANS.monthly.price}
          features={PRICING_PLANS.monthly.features}
          isPopular={true}
          onSelect={handlePlanSelect}
        />
        <PricingCard
          plan={PRICING_PLANS.yearly.name}
          price={PRICING_PLANS.yearly.price}
          features={PRICING_PLANS.yearly.features}
          onSelect={handlePlanSelect}
        />
      </div>
    </div>
  );
}
