import { DealCard } from "../../../../../components/deal-card";
import { IDealListExtended } from "../../../../../types/Deal";

export function Featured({ data }: { data: IDealListExtended }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 text-sm mb-3">
        Featured Deal
      </h3>
      <div className="space-y-3">
        <DealCard data={data} />
      </div>
    </div>
  );
}
