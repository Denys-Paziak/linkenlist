import { Calendar } from "lucide-react";
import { IDeal } from "../../../../../types/Deal";

export function OfferDetails({ data }: { data: IDeal }) {
  const calculateSavings = () => {
    const original = data.originalPrice || 0;
    const your = data.yourPrice || 0;
    if (original > 0 && your >= 0) {
      const savings = original - your;
      const percentage = Math.round((savings / original) * 100);
      return `$${savings.toFixed(2)}/${data.cadencePrice} (${percentage}% off)`;
    }
    return null;
  };

  const savings = calculateSavings();

  return (
    <section
      id="offer-details"
      className="bg-white rounded-lg shadow-sm border border-border p-8 scroll-mt-24"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        Offer Details
      </h2>
      <div className="space-y-4">
        {data.originalPrice === null ? null : (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Original Price:</span>
            <span className="font-medium text-foreground line-through text-lg">
              ${data.originalPrice}/{data.cadencePrice}
            </span>
          </div>
        )}

        {data.yourPrice === null ? null : (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Your Price:</span>
            <span className="font-bold text-green-600 text-xl">
              ${data.yourPrice}/{data.cadencePrice}
            </span>
          </div>
        )}

        {savings === null ? null : (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">You Save:</span>
            <span className="font-bold text-primary bg-primary/20 px-3 py-1 rounded-lg">
              {savings}
            </span>
          </div>
        )}

        <div className="border-t border-border pt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Provider:</span>
            <span className="font-medium text-foreground">
              {data.providerDisplayName}
            </span>
          </div>

          {data.ongoingOffer ? (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valid Until:</span>
              <span className="font-medium text-foreground">Ongoing offer</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valid From:</span>
                <span className="font-medium text-foreground">
                  {data.validFrom}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valid Until:</span>
                <span className="font-medium text-foreground">
                  {data.validUntil}
                </span>
              </div>
            </>
          )}
        </div>

        {data.promoCode && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Promo Code:</span>
              <span className="font-bold text-foreground bg-muted px-3 py-1 rounded-lg">
                {data.promoCode}
              </span>
            </div>

            {data.whereToEnterCode && (
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Where to Enter:</span>
                <span className="font-medium text-foreground text-right max-w-[60%]">
                  {data.whereToEnterCode}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
