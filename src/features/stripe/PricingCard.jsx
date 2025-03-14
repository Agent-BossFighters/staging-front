import { Button } from "@shared/ui/button";
import { Check } from "lucide-react";

export default function PricingCard({
  plan,
  price,
  features,
  comingSoonFeatures,
  isPremium,
  onSelect,
  buttonText = "Subscribe",
}) {
  return (
    <div
      className={`relative p-6 rounded-xl border ${
        isPremium ? "border-yellow-400" : "border-border"
      } bg-background shadow-sm`}
    >
      <div className="text-center mb-6">
        <h3 className="text-3xl font-semibold">{plan}</h3>
        <div className="mt-4">
          <span className="text-3xl font-bold">
            {price === 0 ? "Free" : `$${price.toFixed(2)}`}
          </span>
          {price > 0 && <span className="text-muted-foreground">/month</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Features</h4>
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

      {isPremium && (
        <Button
          className="w-full mt-6 bg-primary text-background hover:bg-primary/90 font-bold uppercase"
          onClick={onSelect}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
