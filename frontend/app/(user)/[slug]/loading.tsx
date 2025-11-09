export default function ResourceLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-6">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Main Content Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Left: Content Skeleton */}
            <div className="flex-1">
              {/* Tags Skeleton */}
              <div className="flex gap-2 mb-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                ))}
              </div>

              {/* Title Skeleton */}
              <div className="h-12 bg-gray-200 rounded animate-pulse mb-4" />

              {/* Description Skeleton */}
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
              </div>

              {/* Login Options Skeleton */}
              <div className="mb-6">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-3 mb-6">
                <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-12 w-24 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Right: Screenshot Skeleton */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Additional Information Skeleton */}
          <div className="border-t border-border pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div>
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Related Resources Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-border p-8">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
