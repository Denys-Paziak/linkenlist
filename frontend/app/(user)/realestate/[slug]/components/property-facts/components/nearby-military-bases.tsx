export function NearbyMilitaryBases() {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Nearby Military Bases
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-900">Camp Pendleton</p>
          <span className="text-[#002244] font-semibold">12 miles</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-900">Naval Base San Diego</p>
          <span className="text-[#002244] font-semibold">35 miles</span>
        </div>
      </div>
    </div>
  );
}
