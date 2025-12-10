import { ResourceCard } from "../../../../../components/resource-card";
import { IResource } from "../../../../../types/Resource";

export function Featured({ data }: { data: IResource }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 text-sm mb-3">
        Featured Resource
      </h3>
      <div className="space-y-3">
        <ResourceCard data={data} />
      </div>
    </div>
  );
}
