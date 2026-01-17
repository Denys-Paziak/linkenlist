import { Map } from "lucide-react";

export function RealestateMap() {
  return (
    <div className="flex-1 bg-gray-200 relative">
      <div
        className="sticky bg-gray-200 md:rounded-lg flex items-center justify-center shadow-sm overflow-hidden"
        style={{
          top: "64px",
          height: "calc(100vh - 64px)",
          overflow: "hidden",
          pointerEvents: "none",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <div className="text-center text-gray-500 p-4 max-w-full">
          <Map className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-gray-400" />
          <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1">
            Interactive Map Coming Soon
          </h3>
          <p className="text-xs sm:text-sm mb-2 md:mb-4">
            Map integration in development
          </p>
          <div className="relative w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] mx-auto aspect-[4/3] bg-gray-100 rounded">
            <img
              src="/placeholder.svg?height=300&width=400"
              alt="Map Placeholder"
              className="w-full h-full object-cover rounded"
              style={{ pointerEvents: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
