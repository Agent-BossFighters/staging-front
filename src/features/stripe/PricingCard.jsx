import { Button } from "@shared/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PricingCard({
  plan,
  price,
  features,
  comingSoonFeatures,
  isPremium,
  onSelect,
  buttonText = "Subscribe",
  showPriceAndLabels = true,
  showButton = true,
}) {
  const navigate = useNavigate();

  const handleCryptoPayment = () => {
    try {
      const params = new URLSearchParams({
        destination_currency: "usdc",
        destination_amount: price.toFixed(2),
        destination_network: "ethereum",
        success_url: `${window.location.origin}/payments/success`,
        cancel_url: `${window.location.origin}/payments/cancel`,
        transaction_details: JSON.stringify({
          type: "subscription",
          plan: plan,
        }),
        client_reference_id: `plan_${plan.toLowerCase()}_${Date.now()}`,
        publishable_key: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
        theme: "dark",
        customer_email: "",
        customer_wallet_address: "",
        source_currency: "usd",
        lock_source_currency: "true",
        lock_destination_currency: "true",
      });

      window.location.href = `https://crypto.link.com?${params.toString()}`;
    } catch (error) {
      console.error("Error initiating crypto payment:", error);
    }
  };

  return (
    <div
      className={`relative p-6 rounded-xl border ${
        isPremium ? "border-yellow-400" : "border-border"
      } bg-background shadow-sm`}
    >
      <div className="text-center mb-6">
        <h3 className="text-3xl font-semibold">{plan}</h3>
        {showPriceAndLabels && (
          <div className="mt-4">
            <span className="text-3xl font-bold">
              {price === 0 ? "Free" : `$${price.toFixed(2)}`}
            </span>
            {price > 0 && <span className="text-muted-foreground">/month</span>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          {showPriceAndLabels && <h4 className="font-medium mb-3">Features</h4>}
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {comingSoonFeatures && comingSoonFeatures.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Coming Soon</h4>
            <ul className="space-y-3">
              {comingSoonFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {feature} (Soon)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isPremium && showButton && (
        <div className="space-y-3 mt-6">
          <Button
            className="w-full bg-primary text-background hover:bg-primary/90 font-bold uppercase"
            onClick={onSelect}
          >
            {buttonText}
          </Button>
        </div>
      )}

      {isPremium && !showButton && <div className="mt-[72px]" />}
    </div>
  );
}
