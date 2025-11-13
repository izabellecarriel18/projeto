export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-lg overflow-hidden animate-pulse">
      <div className="bg-gray-800 aspect-square w-full animate-shimmer" />
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="h-6 bg-gray-800 rounded animate-shimmer w-3/4" />
        <div className="h-4 bg-gray-800 rounded animate-shimmer w-1/2" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-800 rounded animate-shimmer" />
          <div className="h-4 bg-gray-800 rounded animate-shimmer w-5/6" />
        </div>
        <div className="h-8 bg-gray-800 rounded animate-shimmer w-1/3" />
        <div className="h-12 bg-gray-800 rounded animate-shimmer" />
      </div>
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="py-20 animate-pulse">
      <div className="container mx-auto px-4">
        <div className="h-10 bg-gray-800 rounded animate-shimmer w-64 mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 bg-gray-800 rounded animate-shimmer w-3/4" />
              <div className="h-4 bg-gray-800 rounded animate-shimmer" />
              <div className="h-4 bg-gray-800 rounded animate-shimmer w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
