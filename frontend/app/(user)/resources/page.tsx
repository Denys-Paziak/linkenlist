import { ScrollButtons } from "../../../components/scroll-buttons";
import { FeaturedCarousel } from "./components/featured-carousel";
import { List } from "./components/list";

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1">
        {/* Featured Resources Carousel */}
        <section className="bg-gradient-to-br from-primary to-primary/90 text-white py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Featured Resources
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Popular guides and tools recommended for military personnel and
                families.
              </p>
            </div>

            {/* Scrollable Carousel with External Navigation */}
            <FeaturedCarousel />
          </div>
        </section>

        <List />

        <ScrollButtons />
      </div>
    </div>
  );
}
