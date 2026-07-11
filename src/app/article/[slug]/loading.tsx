// Squelette affiche instantanement pendant le chargement d'un article.
export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-10">
      <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-6 h-10 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-3 h-10 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mt-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-8 aspect-video w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    </div>
  );
}
