// Squelette affiche instantanement pendant le chargement d'une categorie.
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-10">
      <div className="h-8 w-56 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-2 h-4 w-80 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-video w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="mt-3 h-5 w-full rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mt-2 h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
