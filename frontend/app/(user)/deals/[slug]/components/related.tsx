import { IDeal } from "../../../../../types/Deal";
import { Card } from "../../components/card";

export function Related({ data }: { data: IDeal["relatedManual"] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8 py-3.5">
      <h3 className="font-bold text-foreground text-lg mb-6">Related Deals</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.slice(0, 3).map((relatedDeal) => (
          <Card
            key={relatedDeal.id}
            data={relatedDeal.target}
          />
        ))}
      </div>
    </div>
  );
}
