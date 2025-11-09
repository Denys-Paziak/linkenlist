export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar Skeleton */}
      <div className="fixed top-14 left-0 right-0 z-30">
        <div className="h-1 bg-gray-200">
          <div className="h-full bg-gray-300 w-0" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="flex gap-8">
          {/* TOC Skeleton - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-gray-200 rounded animate-pulse"
                      style={{ width: `${60 + Math.random() * 40}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1 max-w-4xl">
            {/* Header Skeleton */}
            <header className="mb-8">
              <div className="flex gap-2 mb-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                ))}
              </div>

              <div className="h-12 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-6 w-3/4" />

              <div className="flex gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </header>

            {/* Content Skeleton */}
            <div className="space-y-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
