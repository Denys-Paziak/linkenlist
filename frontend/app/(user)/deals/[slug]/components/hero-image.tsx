import { ExternalLink } from "lucide-react";
import { IDeal } from "../../../../../types/Deal";
import Image from "next/image";

export function HeroImage({ data }: { data: IDeal }) {
  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <Image
        src={data.image.url}
        alt={`Screenshot of ${data.title}`}
        width={data.image.width}
        height={data.image.height}
        className="w-full h-64 md:h-80 lg:h-96 object-cover"
      />
      <div className="absolute bottom-4 right-4">
        <a
          href={data.outboundUrl}
          target="_blank"
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 text-lg shadow-2xl backdrop-blur-sm border border-white/20"
        >
          <ExternalLink className="h-5 w-5" />
          {data.outboundUrlButtonLabel}
        </a>
      </div>
    </div>
  );
}
