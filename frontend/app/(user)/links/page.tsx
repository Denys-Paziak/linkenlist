import { ScrollButtons } from "../../../components/scroll-buttons";
import { List } from "./components/list";

export default function LinksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white border-b-2 border-primary py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find direct links to your military websites. Faster.
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            LinkEnlist is independently operated and is not affiliated with the
            DoD.
          </p>
        </div>
      </div>
      
      <List />
      
      <ScrollButtons />
    </div>
  );
}
