import { ListingPackages } from "../../../../components/listing-packages";

export default function ListingPackagesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Listing Package
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect package for your real estate listing. All
              packages include essential features to help you connect with
              military families.
            </p>
          </div>
          <ListingPackages />
        </div>
      </main>
    </div>
  );
}
