"use client"

interface PropertyImagesProps {
  images: string[]
  imageComments: string[]
  onImageClick: (index: number) => void
}

export function PropertyImages({ images, imageComments, onImageClick }: PropertyImagesProps) {
  return (
    <div className="p-4 pb-0">
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-2 relative">
        {/* Primary Image */}
        <div
          className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md group cursor-pointer"
          onClick={() => onImageClick(0)}
        >
          <img
            src={images[0] || "/placeholder.svg"}
            alt="Property main"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-2 left-2 bg-black/80 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity max-w-[200px] truncate">
            {imageComments[0] || "Property photo"}
          </div>
        </div>

        {/* Secondary Images */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2">
          {images.slice(1, 5).map((img, index) => (
            <div
              key={index + 1}
              className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md group cursor-pointer"
              onClick={() => onImageClick(index + 1)}
            >
              <img
                src={img || "/placeholder.svg"}
                alt={`Property thumbnail ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-black/80 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity max-w-[150px] truncate">
                {imageComments[index + 1] || `Photo ${index + 2}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
