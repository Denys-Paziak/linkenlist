import { ScrollButtons } from "@/components/scroll-buttons";
import { List } from "./components/list";

export default function DealsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white border-b-2 border-primary py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Military & Veteran Discounts and Benefits
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore verified discounts available to service members, veterans,
            and their families. From software and travel to fitness and
            education — all in one place.
          </p>
        </div>
      </div>

      <List />

      <ScrollButtons />
    </div>
  );
}
