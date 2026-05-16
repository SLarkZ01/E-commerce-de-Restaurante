import { EntregaCardSkeleton } from "./EntregaCardSkeleton";

export function SkeletonListaEntregas() {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
        {[1, 2, 3].map((i) => (
          <EntregaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
