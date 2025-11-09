export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-14 bg-primary animate-pulse" />
      <main className="w-full px-4 py-8 pb-8 flex-grow">
        <div className="text-center mb-8">
          <div className="h-10 bg-gray-200 rounded animate-pulse mb-4 max-w-2xl mx-auto" />
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-6 max-w-xl mx-auto" />
          <div className="h-12 bg-gray-200 rounded animate-pulse max-w-[1120px] mx-auto" />
        </div>

        <div className="resource-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md border-2 border-blue-200 h-[215px] animate-pulse">
              <div className="p-4 h-full flex flex-col">
                <div className="w-[370px] h-[170px] bg-gray-200 rounded-md mb-2 mx-auto" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded mb-2" />
                <div className="flex gap-1 mt-auto">
                  <div className="h-6 w-12 bg-gray-200 rounded" />
                  <div className="h-6 w-12 bg-gray-200 rounded" />
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
