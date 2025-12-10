import { Hero } from "./components/hero";
import { PublicationListing } from "./components/publication-listing";
import { FeaturedDeals } from "./components/featured-deals";
import { WhyLinkEnlist } from "./components/why-linkenlist";
import { FeaturedResources } from "./components/featured-resources";
import { AboutUs } from "./components/about-us";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <PublicationListing />
      <FeaturedDeals />
      <WhyLinkEnlist />
      <FeaturedResources />
      <AboutUs />
    </div>
  );
}
