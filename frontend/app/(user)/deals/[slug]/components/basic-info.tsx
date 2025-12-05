import { capitalize } from "../../../../../lib/utils";
import { IDeal } from "../../../../../types/Deal";

export function BasicInfo({ data }: { data: IDeal }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-8">
      <div className="relative mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
          {data.title}
        </h1>
      </div>

      <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
        {data.teaser}
      </p>

      <div className="flex flex-wrap gap-2">
        {data.categories.map((item, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
          >
            {capitalize(item)}
          </span>
        ))}
        {data.tags.map((item, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}
