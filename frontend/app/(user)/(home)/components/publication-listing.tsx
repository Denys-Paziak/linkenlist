import { ListingPackages } from "../../../../components/listing-packages";

export function PublicationListing() {
  return (
    <section className="max-w-5xl mx-auto px-4 md:py-16 py-0">
      <div className="max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          List your home for the military community
        </h2>

        {/* Subhead */}
        <p className="text-lg md:text-xl text-slate-700 mb-6">
          Rent or sell near any base. Reach military families in minutes.
        </p>
      </div>

      <ListingPackages />
    </section>
  );
}
