import { EnhancedResourceCard } from "../../../../../components/enhanced-resource-card";
import { IResource } from "../../../../../types/Resource";
import { Card } from "../../components/card";

export function Featured({ data }: { data: IResource }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <h3 className="font-semibold text-gray-900 text-sm mb-3">
        Featured Resource
      </h3>
      <div className="space-y-3">
        <Card
          data={{
            id: data.id,
            title: data.title,
            teaser: data.teaser,
            image: data.image,
            slug: data.slug,
            categories: data.categories as any,
            tags: data.tags,
            status: data.status as any,
            updatedAt: data.updatedAt,            
            outboundUrl: "",
            popularScore: 0,
            totalHelpful: 0,
          }}
        />
      </div>
    </div>
  );
}
