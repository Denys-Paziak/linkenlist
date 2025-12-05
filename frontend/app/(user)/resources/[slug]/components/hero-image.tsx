import Image from "next/image";
import { IResource } from "../../../../../types/Resource";

export function HeroImage({ data }: { data: IResource }) {
  return (
    <div className="relative bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      <Image
        src={data.image.url}
        alt={`Screenshot of ${data.title}`}
        width={data.image.width}
        height={data.image.height}
        className="w-full h-64 md:h-80 lg:h-96 object-cover"
      />
    </div>
  );
}
