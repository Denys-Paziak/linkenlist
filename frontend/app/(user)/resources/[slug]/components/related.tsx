import { IResource } from "../../../../../types/Resource";
import { Card } from "../../components/card";

export function Related({ data }: { data: IResource["relatedManual"] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8 py-3.5">
      <h3 className="font-bold text-foreground text-lg mb-6">Related Resources</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.slice(0, 3).map((relatedResource) => (
          <Card
            key={relatedResource.id}
            data={relatedResource.target}
          />
        ))}
      </div>
    </div>
  );
}
