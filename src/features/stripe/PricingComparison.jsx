import { useState } from "react";
import PricingCard from "./PricingCard";
import { useStripeCheckout } from "./hooks/useStripeCheckout";

// Vérification de la variable d'environnement
const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID;
if (!STRIPE_PRICE_ID) {
  console.error("VITE_STRIPE_PRICE_ID is not defined in .env file");
}

const PRICING_PLANS = {
  freemium: {
    name: "FREEMIUM",
    price: 0,
    features: ["Locker", "Data Lab (Basic Filters)", "Daily", "Fighting (Participate)","TV Tools (Boss Wheel)", "Player Map v1"],
    comingSoonFeatures: ["Schedule", "TV Tools (new tools)"],
  },
  pro: {
    name: "PREMIUM",
    price: 11.99,
    priceId: STRIPE_PRICE_ID,
    features: ["Locker", "Data Lab (Full filters)", "Daily", "Monthly", "Fighting (Create/Participate)", "Missions","TV Tools (Boss Wheel)", "Player Map v1"],
    comingSoonFeatures: ["Schedule", "TV Tools", "Data Lab (Player Cycle)"],
  },
};

export default function PricingComparison() {
  const { initiateCheckout } = useStripeCheckout();

  const handlePlanSelect = async () => {
    if (!STRIPE_PRICE_ID) {
      console.error("Cannot initiate checkout: STRIPE_PRICE_ID is missing");
      return;
    }
    await initiateCheckout(PRICING_PLANS.pro.priceId);
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-yellow-400">
          UNLOCK PREMIUM FEATURES/TOOLS
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-white">
          We're working hard on creating many tools/information for you! While
          there are plenty of features for free users, if you want to have
          access to all tools and/or participate in community events, the
          premium is for you!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <PricingCard
          plan={PRICING_PLANS.freemium.name}
          price={PRICING_PLANS.freemium.price}
          features={PRICING_PLANS.freemium.features}
          comingSoonFeatures={PRICING_PLANS.freemium.comingSoonFeatures}
        />
        <PricingCard
          plan={PRICING_PLANS.pro.name}
          price={PRICING_PLANS.pro.price}
          features={PRICING_PLANS.pro.features}
          comingSoonFeatures={PRICING_PLANS.pro.comingSoonFeatures}
          isPremium={true}
          onSelect={handlePlanSelect}
        />
      </div>
    </div>
  );
}
